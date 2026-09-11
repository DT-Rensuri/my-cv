/**
 * TTS Web Worker.
 *
 * Runs audio synthesis (network fetch) off the main thread so that
 * heavy downloads / blob decoding never block UI rendering or the
 * Live2D animation loop.
 *
 * Protocol:
 *   main -> worker : { type: 'synthesize', id, text, voice? }
 *   worker -> main : { type: 'result', id, blob }
 *                    { type: 'error', id, message }
 */

export interface TtsWorkerRequest {
    type: 'synthesize';
    id: number;
    text: string;
    voice?: string;
}

export interface TtsWorkerResult {
    type: 'result';
    id: number;
    blob: Blob;
}

export interface TtsWorkerError {
    type: 'error';
    id: number;
    message: string;
}

export type TtsWorkerResponse =
    | TtsWorkerResult
    | TtsWorkerError;

const TTS_STREAM_ENDPOINT = '/api/tts/stream';

function buildStreamUrl(text: string, voice?: string): string {
    const params = new URLSearchParams({
        text: text,
    });

    if (voice) {
        params.set('voice', voice);
    }

    return `${TTS_STREAM_ENDPOINT}?${params.toString()}`;
}

async function synthesize(
    text: string,
    voice?: string,
): Promise<Blob> {
    const response = await fetch(buildStreamUrl(text, voice), {
        method: 'GET',
        headers: {
            Accept: 'audio/wav',
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error(
            `TTS stream request failed: ${response.status}`,
        );
    }

    return response.blob();
}

self.onmessage = async (
    event: MessageEvent<TtsWorkerRequest>,
): Promise<void> => {
    const request = event.data;

    if (request.type !== 'synthesize') {
        return;
    }

    try {
        const blob = await synthesize(request.text, request.voice);

        const response: TtsWorkerResult = {
            type: 'result',
            id: request.id,
            blob: blob,
        };

        self.postMessage(response);
    } catch (error) {
        const response: TtsWorkerError = {
            type: 'error',
            id: request.id,
            message:
                error instanceof Error
                    ? error.message
                    : String(error),
        };

        self.postMessage(response);
    }
};
