import type {
    TtsWorkerError,
    TtsWorkerRequest,
    TtsWorkerResponse,
    TtsWorkerResult,
} from './tts-worker';
import TtsWorker from './tts-worker?worker';

/**
 * Main-thread client for the TTS Web Worker.
 *
 * - Lazily spawns the worker
 * - Maps request ids to pending promises
 * - Supports cancellation (rejects pending promises on terminate)
 */
export class TtsWorkerClient {
    private worker: Worker | null = null;

    private nextRequestId = 0;

    private pending = new Map<
        number,
        {
            resolve: (blob: Blob) => void;
            reject: (error: Error) => void;
        }
    >();

    private ensureWorker(): Worker {
        if (this.worker) {
            return this.worker;
        }

        this.worker = new TtsWorker();

        this.worker.onmessage = (
            event: MessageEvent<TtsWorkerResponse>,
        ) => {
            const message = event.data;

            const entry = this.pending.get(message.id);

            if (!entry) {
                return;
            }

            this.pending.delete(message.id);

            if (message.type === 'result') {
                entry.resolve(
                    (message as TtsWorkerResult).blob,
                );
            } else {
                entry.reject(
                    new Error(
                        (message as TtsWorkerError).message,
                    ),
                );
            }
        };

        this.worker.onerror = (event) => {
            // Worker-level failure: reject everything.
            const error = new Error(
                event.message || 'TTS worker crashed',
            );

            this.rejectAll(error);

            this.terminate();
        };

        return this.worker;
    }

    /**
     * Synthesize text to audio off the main thread.
     */
    synthesize(text: string, voice?: string): Promise<Blob> {
        const worker = this.ensureWorker();

        const id = this.nextRequestId++;

        return new Promise<Blob>((resolve, reject) => {
            this.pending.set(id, { resolve, reject });

            const request: TtsWorkerRequest = {
                type: 'synthesize',
                id: id,
                text: text,
                voice: voice,
            };

            worker.postMessage(request);
        });
    }

    /**
     * Reject all pending requests (used on stop / crash).
     */
    private rejectAll(error: Error): void {
        this.pending.forEach((entry) => {
            entry.reject(error);
        });

        this.pending.clear();
    }

    /**
     * Kill the worker and reject pending requests.
     */
    terminate(): void {
        this.rejectAll(new Error('TTS worker terminated'));

        this.worker?.terminate();

        this.worker = null;
    }
}
