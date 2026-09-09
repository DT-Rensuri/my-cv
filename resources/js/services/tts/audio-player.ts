import type { TtsLipSync } from './types';

/**
 * Single shared <audio> element wrapper.
 *
 * - Blob URLs
 * - Streaming URLs
 * - Object URL lifecycle
 * - Optional lightweight audio amplitude analysis for lip-sync
 */
export class AudioPlayer {
    private audio = new Audio();

    private audioContext: AudioContext | null = null;
    private sourceNode: MediaElementAudioSourceNode | null = null;
    private analyser: AnalyserNode | null = null;

    private currentObjectUrl: string | null = null;

    // Lip-sync
    private analysisBuffer: Float32Array<ArrayBuffer> | null = null;
    private lipSyncRafId: number | null = null;

    // Smoothed mouth value
    private mouthOpen = 0;

    // Tuning
    private readonly analyserFftSize = 512;

    // Amplitude threshold.
    // Below this value the mouth is considered closed.
    private readonly silenceThreshold = 0.015;

    // Amplitude that corresponds approximately to mouth = 1.
    private readonly maxAmplitude = 0.2;

    // Smoothing.
    // Higher = reacts faster.
    private readonly attack = 0.55;

    // Lower = closes more smoothly.
    private readonly release = 0.2;

    constructor(private lipSync?: TtsLipSync) {}

    /**
     * Play a pre-synthesized blob.
     */
    playBlob(blob: Blob): Promise<void> {
        this.cleanupObjectUrl();

        const url = URL.createObjectURL(blob);
        this.currentObjectUrl = url;

        return this.play(url, true);
    }

    /**
     * Play directly from a streaming URL.
     */
    playStreamUrl(url: string): Promise<void> {
        this.cleanupObjectUrl();

        return this.play(url, false);
    }

    /**
     * Pause and reset playback.
     */
    pause(): void {
        this.audio.pause();
        this.audio.currentTime = 0;

        this.stopLipSync();
    }

    /**
     * Stop audio completely.
     */
    stop(): void {
        this.audio.pause();
        this.audio.currentTime = 0;

        this.stopLipSync();

        this.audio.removeAttribute('src');
        this.audio.load();

        this.cleanupObjectUrl();
    }

    /**
     * Cleanup resources.
     */
    cleanup(): void {
        this.stopLipSync();
        this.cleanupObjectUrl();

        if (this.sourceNode) {
            try {
                this.sourceNode.disconnect();
            } catch {
                // Ignore disconnect errors.
            }

            this.sourceNode = null;
        }

        if (this.analyser) {
            try {
                this.analyser.disconnect();
            } catch {
                // Ignore disconnect errors.
            }

            this.analyser = null;
        }

        if (this.audioContext) {
            void this.audioContext.close().catch(() => {});
            this.audioContext = null;
        }

        this.analysisBuffer = null;
    }

    /**
     * Main playback function.
     */
    private play(url: string, revokeOnEnd: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.audio.src = url;

            const cleanup = () => {
                this.audio.onended = null;
                this.audio.onerror = null;
            };

            this.audio.onended = () => {
                cleanup();

                this.stopLipSync();

                if (revokeOnEnd) {
                    this.cleanupObjectUrl();
                }

                resolve();
            };

            this.audio.onerror = () => {
                cleanup();

                this.stopLipSync();
                this.cleanupObjectUrl();

                reject(new Error('Audio playback failed'));
            };

            this.audio
                .play()
                .then(() => {
                    // Only initialize audio analysis when lip-sync exists.
                    if (this.lipSync) {
                        this.startLipSync();
                    }
                })
                .catch((error) => {
                    cleanup();
                    this.stopLipSync();

                    reject(error);
                });
        });
    }

    /**
     * Initialize Web Audio analysis.
     *
     * This is only called when lipSync exists.
     */
    private initAudioAnalysis(): boolean {
        if (!this.lipSync) {
            return false;
        }

        // Already initialized.
        if (this.audioContext && this.analyser && this.sourceNode) {
            return true;
        }

        try {
            const AudioContextClass =
                window.AudioContext ||
                (
                    window as typeof window & {
                        webkitAudioContext?: typeof AudioContext;
                    }
                ).webkitAudioContext;

            if (!AudioContextClass) {
                return false;
            }

            this.audioContext = new AudioContextClass();

            /**
             * IMPORTANT:
             *
             * MediaElementAudioSourceNode can only be created once
             * for the same <audio> element.
             */
            this.sourceNode = this.audioContext.createMediaElementSource(
                this.audio,
            );

            this.analyser = this.audioContext.createAnalyser();

            this.analyser.fftSize = this.analyserFftSize;

            // We don't need frequency analysis.
            // Time-domain amplitude is enough.
            this.analyser.smoothingTimeConstant = 0.65;

            /**
             * Audio chain:
             *
             * <audio>
             *    ↓
             * sourceNode
             *    ↓
             * analyser
             *    ↓
             * destination
             */
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            /**
             * Explicit ArrayBuffer avoids:
             *
             * Float32Array<ArrayBufferLike>
             * vs
             * Float32Array<ArrayBuffer>
             *
             * TypeScript error.
             */
            const bufferSize = this.analyser.fftSize;

            this.analysisBuffer = new Float32Array(
                new ArrayBuffer(bufferSize * 4),
            );

            return true;
        } catch (error) {
            console.warn('[AudioPlayer] Failed to initialize lip-sync:', error);

            this.audioContext = null;
            this.sourceNode = null;
            this.analyser = null;
            this.analysisBuffer = null;

            return false;
        }
    }

    /**
     * Start lightweight amplitude-based lip-sync.
     */
    private startLipSync(): void {
        if (!this.lipSync) {
            return;
        }

        if (this.lipSyncRafId !== null) {
            return;
        }

        if (!this.initAudioAnalysis()) {
            return;
        }

        // Browser may suspend AudioContext.
        if (this.audioContext && this.audioContext.state === 'suspended') {
            void this.audioContext.resume().catch(() => {});
        }

        this.mouthOpen = 0;

        const animate = () => {
            this.lipSyncRafId = requestAnimationFrame(animate);

            if (!this.lipSync || !this.analyser || !this.analysisBuffer) {
                return;
            }

            /**
             * Get raw PCM samples.
             *
             * Values are approximately:
             *
             * -1.0 ... +1.0
             */
            this.analyser.getFloatTimeDomainData(this.analysisBuffer);

            /**
             * RMS = Root Mean Square
             *
             * This gives us the overall loudness/amplitude
             * of the current audio frame.
             */
            let sumSquares = 0;

            const buffer = this.analysisBuffer;

            for (let i = 0; i < buffer.length; i++) {
                const sample = buffer[i];
                sumSquares += sample * sample;
            }

            const rms = Math.sqrt(sumSquares / buffer.length);

            /**
             * Ignore very quiet background/noise.
             */
            if (rms <= this.silenceThreshold) {
                this.mouthOpen += (0 - this.mouthOpen) * this.release;
            } else {
                /**
                 * Convert amplitude:
                 *
                 * silenceThreshold -> 0
                 * maxAmplitude     -> 1
                 */
                let target =
                    (rms - this.silenceThreshold) /
                    (this.maxAmplitude - this.silenceThreshold);

                target = Math.max(0, Math.min(1, target));

                /**
                 * Non-linear curve.
                 *
                 * Makes quiet speech less twitchy
                 * while strong syllables open the mouth more.
                 */
                target = Math.pow(target, 0.65);

                /**
                 * Attack / release smoothing.
                 */
                const smoothing =
                    target > this.mouthOpen ? this.attack : this.release;

                this.mouthOpen += (target - this.mouthOpen) * smoothing;
            }

            /**
             * Final safety clamp.
             */
            const value = Math.max(0, Math.min(1, this.mouthOpen));

            this.lipSync.startLipSync(value);
        };

        animate();
    }

    /**
     * Stop lip-sync animation.
     */
    private stopLipSync(): void {
        if (this.lipSyncRafId !== null) {
            cancelAnimationFrame(this.lipSyncRafId);
            this.lipSyncRafId = null;
        }

        this.mouthOpen = 0;

        if (this.lipSync) {
            this.lipSync.stopLipSync();
        }
    }

    /**
     * Revoke current Blob URL.
     */
    private cleanupObjectUrl(): void {
        if (!this.currentObjectUrl) {
            return;
        }

        URL.revokeObjectURL(this.currentObjectUrl);
        this.currentObjectUrl = null;
    }
}
