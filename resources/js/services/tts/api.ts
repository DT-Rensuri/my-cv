const TTS_STREAM_ENDPOINT = '/api/tts/stream';

export function buildStreamUrl(
    text: string,
    voice?: string,
): string {
    const params = new URLSearchParams({
        text: text,
    });

    if (voice) {
        params.set('voice', voice);
    }

    return `${TTS_STREAM_ENDPOINT}?${params.toString()}`;
}
