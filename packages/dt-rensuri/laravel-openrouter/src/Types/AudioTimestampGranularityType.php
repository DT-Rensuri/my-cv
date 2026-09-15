<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\Types;

/**
 * A timestamp detail level for verbose_json transcription responses.
 * "segment" returns segment-level timestamps; "word" additionally returns
 * word-level timestamps in the words array.
 * See: https://openrouter.ai/docs/api/api-reference/audio/create-transcription
 */
final class AudioTimestampGranularityType
{
    /**
     * Segment-level timestamps.
     */
    const SEGMENT = 'segment';

    /**
     * Word-level timestamps in the words array.
     */
    const WORD = 'word';

    public static function getAllowedValues(): array
    {
        return [
            self::SEGMENT,
            self::WORD,
        ];
    }
}