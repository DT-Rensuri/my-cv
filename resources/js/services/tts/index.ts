import type { TtsJobOptions } from '@/types/tts';

export interface TtsJob {
    id: number;
    text: string;
    audio?: Blob;
}

function isAutoplayBlock(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'NotAllowedError';
}

export class TtsQueue {
    private static readonly MAX_CONCURRENT_REQUESTS = 10;

    private queue: TtsJob[] = [];
    private audioBuffer = new Map<number, TtsJob>();
    private failedIds = new Set<number>();

    private activeRequests = 0;

    private nextPlaybackId = 0;
    private nextId = 0;

    private playing = false;
    private stopped = false;
    private waitingForUnlock = false;

    private audio = new Audio();

    
    private currentObjectUrl: string | null = null;

    private generation = 0;

    private firstStreamingJobId: number | null = null;
    private firstStreamingFinished = false;

    constructor(
        private voice?: string,
        private onJobStart?: (job: TtsJob) => void,
        private onJobEnd?: (job: TtsJob) => void,
        private onError?: (error: unknown, job: TtsJob | undefined) => void,
        private lipSync?: {
            startLipSync: (mouthOpenSize: number) => void;
            stopLipSync: () => void;
        },
    ) {}

    async unlock(): Promise<boolean> {
        void this.processPlayback();

        return true;
    }

    add(text: string, _options: TtsJobOptions = {}): number {
        const job: TtsJob = {
            id: this.nextId++,
            text,
        };

        this.stopped = false;

        if (this.isIdle()) {
            this.startNewCycle(job);

            return job.id;
        }

        this.queue.push(job);

        this.process();

        return job.id;
    }

    private startNewCycle(job: TtsJob): void {
        this.firstStreamingJobId = job.id;
        this.firstStreamingFinished = false;

        this.nextPlaybackId = job.id;

        void this.playFirstJobStreaming(job);

        this.process();
    }

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

    private async synthesizeJob(job: TtsJob): Promise<void> {
        const requestGeneration = this.generation;

        try {
            const audio = await this.synthesize(job.text);

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

    private async playFirstJobStreaming(job: TtsJob): Promise<void> {
        const requestGeneration = this.generation;

        this.playing = true;

        this.onJobStart?.(job);

        try {
            console.log(
                `Streaming TTS job ${job.id} (text: "${job.text}")`,
            );

            await this.playStreamUrl(
                this.streamUrl(job.text, this.voice),
            );

            if (this.stopped || requestGeneration !== this.generation) {
                return;
            }

            this.nextPlaybackId = job.id + 1;
            this.firstStreamingFinished = true;
        } catch (error) {
            if (this.stopped || requestGeneration !== this.generation) {
                return;
            }

            if (isAutoplayBlock(error)) {
                this.waitForUnlock();

                return;
            }

            console.error(
                `Audio streaming error for job ${job.id}:`,
                error,
            );

            this.onError?.(error, job);

            this.failedIds.add(job.id);

            this.nextPlaybackId = job.id + 1;
            this.firstStreamingFinished = true;
        } finally {
            this.playing = false;

            this.onJobEnd?.(job);

            if (
                !this.stopped &&
                requestGeneration === this.generation
            ) {
                void this.processPlayback();
            }
        }
    }

    private async processPlayback(): Promise<void> {
        if (this.stopped || this.playing) {
            return;
        }

        if (
            this.firstStreamingJobId !== null &&
            !this.firstStreamingFinished
        ) {
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
            console.log(
                `Playing TTS job ${job.id} (text: "${job.text}")`,
            );

            await this.playBlob(job.audio!);

            this.audioBuffer.delete(job.id);

            this.nextPlaybackId++;
        } catch (error) {
            if (this.stopped) {
                return;
            }

            if (isAutoplayBlock(error)) {
                this.waitForUnlock();

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

        this.firstStreamingJobId = null;
        this.firstStreamingFinished = false;

        this.nextPlaybackId = this.nextId;
    }

    private waitForUnlock(): void {
        if (this.waitingForUnlock) {
            return;
        }

        const events = [
            'pointerdown',
            'keydown',
            'touchstart',
        ] as const;

        const onGesture = () => {
            events.forEach((event) => {
                window.removeEventListener(event, onGesture);
            });

            this.waitingForUnlock = false;

            void this.unlock();
        };

        this.waitingForUnlock = true;

        events.forEach((event) => {
            window.addEventListener(event, onGesture, {
                once: true,
                passive: true,
            });
        });
    }

    private async synthesize(text: string): Promise<Blob> {
        const params = new URLSearchParams({
            text,
        });

        if (this.voice) {
            params.set('voice', this.voice);
        }

        const response = await fetch(
            `/api/tts/stream?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'audio/wav',
                },
                credentials: 'same-origin',
            },
        );

        if (!response.ok) {
            throw new Error(
                `TTS stream request failed: ${response.status}`,
            );
        }

        return response.blob();
    }

    private playBlob(blob: Blob): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cleanupAudioUrl();

            const url = URL.createObjectURL(blob);

            this.currentObjectUrl = url;

            this.audio.src = url;

            const cleanup = () => {
                this.audio.onended = null;
                this.audio.onerror = null;
            };

            this.audio.onended = () => {
                cleanup();

                this.cleanupAudioUrl();

                resolve();
            };

            this.audio.onerror = () => {
                cleanup();

                this.cleanupAudioUrl();

                reject(new Error('Audio playback failed'));
            };

            this.audio.play().catch((error) => {
                cleanup();

                reject(error);
            });
        });
    }

    private playStreamUrl(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cleanupAudioUrl();

            this.audio.src = url;

            const cleanup = () => {
                this.audio.onended = null;
                this.audio.onerror = null;
            };

            this.audio.onended = () => {
                cleanup();

                resolve();
            };

            this.audio.onerror = () => {
                cleanup();

                reject(new Error('Audio playback failed'));
            };

            this.audio.play().catch((error) => {
                cleanup();

                reject(error);
            });
        });
    }

    private streamUrl(text: string, voice?: string): string {
        const params = new URLSearchParams({
            text,
        });

        if (voice) {
            params.set('voice', voice);
        }

        return `/api/tts/stream?${params.toString()}`;
    }

    private cleanupAudioUrl(): void {
        if (!this.currentObjectUrl) {
            return;
        }

        URL.revokeObjectURL(this.currentObjectUrl);

        this.currentObjectUrl = null;
    }

    clear(): void {
        this.queue = [];

        this.audioBuffer.clear();

        this.failedIds.clear();
    }

    stop(): void {
        this.stopped = true;

        this.generation++;

        this.clear();

        this.audio.pause();

        this.audio.currentTime = 0;

        this.playing = false;

        this.firstStreamingJobId = null;
        this.firstStreamingFinished = false;

        this.nextPlaybackId = this.nextId;

        this.cleanupAudioUrl();
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
}