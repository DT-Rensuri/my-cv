<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\Types;

/**
 * The response format for a transcription request.
 * "json" (default) returns { text, usage }; "verbose_json" additionally
 * returns task, language, duration, and segment-level timestamps.
 * See: https://openrouter.ai/docs/api/api-reference/audio/create-transcription
 */
final readonly class AudioResponseFormatType
{
    /**
     * Returns { text, usage }.
     */
    const JSON = 'json';

    /**
     * Additionally returns task, language, duration, and segment-level timestamps.
     */
    const VERBOSE_JSON = 'verbose_json';

    public static function getAllowedValues(): array
    {
        return [
            self::JSON,
            self::VERBOSE_JSON,
        ];
    }
}