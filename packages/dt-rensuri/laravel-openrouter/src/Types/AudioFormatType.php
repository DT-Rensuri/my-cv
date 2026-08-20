<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\Types;

/**
 * Audio can be provided in different formats.
 * See: https://openrouter.ai/docs/features/multimodal/audio
 */
final readonly class AudioFormatType
{
    /**
     * MP3 audio format
     */
    const MP3 = 'mp3';

    /**
     * WAV audio format
     */
    const WAV = 'wav';

    /**
     * WEBM audio format
     */
    const WEBM = 'webm';

    /**
     * FLAC audio format
     */
    const FLAC = 'flac';

    /**
     * M4A audio format
     */
    const M4A = 'm4a';

    /**
     * OGG audio format
     */
    const OGG = 'ogg';

    /**
     * AAC audio format
     */
    const AAC = 'aac';

    public static function getAllowedValues(): array
    {
        return [
            self::MP3,
            self::WAV,
            self::WEBM,
            self::FLAC,
            self::M4A,
            self::OGG,
            self::AAC,
        ];
    }
}
