const TTS_STREAM_ENDPOINT = '/api/tts/stream';

export function buildStreamUrl(
    text: string,
    voice?: string,
): string {
    const params = new URLSearchParams({
        text,
    });

    if (voice) {
        params.set('voice', voice);
    }

    return `${TTS_STREAM_ENDPOINT}?${params.toString()}`;
}

/**
 * Synthesize text to audio via the TTS stream endpoint.
 */
export async function synthesize(
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
