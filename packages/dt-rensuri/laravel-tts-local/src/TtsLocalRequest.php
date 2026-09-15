<?php

declare(strict_types=1);

namespace DtRensuri\LaravelTtsLocal;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Http\Message\ResponseInterface;
use ReflectionException;

/**
 * TtsLocalRequest is responsible for calling the local TTS (Vieneu / FastAPI)
 * service and returning the raw audio stream.
 *
 * The Guzzle client is injected directly (bound under the package-specific
 * 'laravel-tts-local.http' key) so this package never depends on the global
 * ClientInterface container binding.
 */
final class TtsLocalRequest
{
    public function __construct(
        private readonly Client $client,
    ) {}

    /**
     * Lists the available voices from the local TTS service.
     *
     * @throws ReflectionException|GuzzleException
     */
    public function voices(): array
    {
        $response = $this->client->request(
            'GET',
            '/voices'
        );

        return $this->decode($response);
    }

    /**
     * Synthesizes the given text into audio and returns the raw WAV bytes.
     *
     * @throws ReflectionException|GuzzleException
     */
    public function synthesize(string $text, ?string $voice = null): string
    {
        $query = ['text' => $text];

        if ($voice) {
            $query['voice'] = $voice;
        }

        $response = $this->client->request(
            'GET',
            '/stream',
            ['query' => $query]
        );

        return (string) $response->getBody();
    }

    /**
     * Synthesizes the given text and streams the WAV back chunk-by-chunk,
     * preserving the streaming behavior of the local TTS service instead of
     * buffering the whole response in memory.
     *
     * Returns a PSR-7 stream read directly from the underlying Guzzle
     * stream (stream => true), so callers can echo chunks as they arrive.
     *
     * @param  array<string, mixed>  $options  Extra Guzzle request options.
     * @return ResponseInterface PSR-7 response whose body is a live stream.
     *
     * @throws ReflectionException|GuzzleException
     */
    public function streamSynthesize(
        string $text,
        ?string $voice = null,
        array $options = [],
    ): ResponseInterface {
        $query = ['text' => $text];

        if ($voice) {
            $query['voice'] = $voice;
        }

        $options['query'] = $query;
        $options['stream'] = true;

        return $this->client->request('GET', '/stream', $options);
    }

    /**
     * Decodes a JSON response body into an array.
     */
    private function decode(ResponseInterface $response): array
    {
        $body = (string) $response->getBody();

        return $body ? json_decode($body, true) : [];
    }
}
