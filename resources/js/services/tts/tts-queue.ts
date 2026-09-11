import type {
    TtsErrorListener,
    TtsJob,
    TtsJobListener,
    TtsJobOptions,
    TtsLipSync,
} from './types';

import { AudioPlayer } from './audio-player';
import { isAutoplayBlock, waitForUserGesture } from './autoplay';
import { TtsWorkerClient } from './tts-worker-client';
export class TtsQueue {
    private static readonly MAX_CONCURRENT_REQUESTS = 3;

    private queue: TtsJob[] = [];
    private audioBuffer = new Map<number, TtsJob>();
    private failedIds = new Set<number>();

    private activeRequests = 0;

    private nextPlaybackId = 0;
    private nextId = 0;

    private playing = false;
    private stopped = false;
    private waitingForUnlock = false;

    private player: AudioPlayer;
    private workerClient = new TtsWorkerClient();
    private generation = 0;

    constructor(
        private voice?: string,
        private onJobStart?: TtsJobListener,
        private onJobEnd?: TtsJobListener,
        private onError?: TtsErrorListener,
        private lipSync?: TtsLipSync,
    ) {
        this.player = new AudioPlayer(lipSync);
    }

    async unlock(): Promise<boolean> {
        void this.processPlayback();

        return true;
    }

    add(text: string, _options: TtsJobOptions = {}): number {
        const job: TtsJob = {
            id: this.nextId++,
            text: text
        };

        this.stopped = false;

        this.queue.push(job);

        this.process();

        return job.id;
    }

    clear(): void {
        this.queue = [];

        this.audioBuffer.clear();

        this.failedIds.clear();
    }

    stop(): void {
        this.stopped = true;

        this.lipSync?.stopLipSync();

        this.generation++;

        this.clear();

        this.player.pause();

        this.playing = false;

        this.nextPlaybackId = this.nextId;

        this.player.cleanup();

        this.workerClient.terminate();
    }

    get length(): number {
        return this.queue.length;
    }

    get active(): number {
        return this.activeRequests;
    }

    get buffered(): number {
        return this.audioBuffer.size;
    }

    get isPlaying(): boolean {
        return this.playing;
    }

    get nextIdToPlay(): number {
        return this.nextPlaybackId;
    }

    get pending(): number {
        return (
            this.queue.length +
            this.activeRequests +
            this.audioBuffer.size +
            (this.playing ? 1 : 0)
        );
    }

    // ------------------------------------------------------------------
    // Scheduling
    // ------------------------------------------------------------------

    private isIdle(): boolean {
        return (
            !this.playing &&
            this.queue.length === 0 &&
            this.activeRequests === 0 &&
            this.audioBuffer.size === 0
        );
    }

    private process(): void {
        if (this.stopped) {
            return;
        }

        while (
            this.activeRequests < TtsQueue.MAX_CONCURRENT_REQUESTS &&
            this.queue.length > 0
        ) {
            const job = this.queue.shift();

            if (!job) {
                break;
            }

            this.activeRequests++;

            void this.synthesizeJob(job);
        }
    }

    // ------------------------------------------------------------------
    // Synthesis
    // ------------------------------------------------------------------

    private async synthesizeJob(job: TtsJob): Promise<void> {
        const requestGeneration = this.generation;

         try {
            const audio = await this.workerClient.synthesize(
                job.text,
                this.voice,
            );

            if (this.stopped || requestGeneration !== this.generation) {
                return;
            }

            job.audio = audio;

            this.audioBuffer.set(job.id, job);

            void this.processPlayback();
        } catch (error) {
            console.error(`TTS error for job ${job.id}:`, error);

            this.onError?.(error, job);

            if (!this.stopped && requestGeneration === this.generation) {
                this.failedIds.add(job.id);

                void this.processPlayback();
            }
        } finally {
            this.activeRequests--;

            this.process();

            if (!this.stopped && requestGeneration === this.generation) {
                void this.processPlayback();
            }
        }
    }

    // ------------------------------------------------------------------
    // Playback
    // ------------------------------------------------------------------

    private async processPlayback(): Promise<void> {
        if (this.stopped || this.playing) {
            return;
        }

        while (this.failedIds.has(this.nextPlaybackId)) {
            this.failedIds.delete(this.nextPlaybackId);

            this.nextPlaybackId++;
        }

        const job = this.audioBuffer.get(this.nextPlaybackId);

        if (!job) {
            this.checkCycleComplete();

            return;
        }

        this.playing = true;

        this.onJobStart?.(job);

        try {
            await this.player.playBlob(job.audio!);

            this.audioBuffer.delete(job.id);

            this.nextPlaybackId++;
        } catch (error) {
            if (this.stopped) {
                return;
            }

            if (this.handleAutoplayBlock(error)) {
                return;
            }

            console.error(
                `Audio playback error for job ${job.id}:`,
                error,
            );

            this.onError?.(error, job);

            this.audioBuffer.delete(job.id);

            this.failedIds.add(job.id);

            this.nextPlaybackId++;
        } finally {
            this.playing = false;

            this.onJobEnd?.(job);

            if (!this.stopped) {
                this.checkCycleComplete();

                void this.processPlayback();
            }
        }
    }

    private checkCycleComplete(): void {
        if (!this.isIdle()) {
            return;
        }

        this.nextPlaybackId = this.nextId;
    }

    private handleAutoplayBlock(error: unknown): boolean {
        if (!isAutoplayBlock(error)) {
            return false;
        }

        if (this.waitingForUnlock) {
            return true;
        }

        this.waitingForUnlock = true;

        waitForUserGesture(() => {
            this.waitingForUnlock = false;

            void this.unlock();
        });

        return true;
    }
}
