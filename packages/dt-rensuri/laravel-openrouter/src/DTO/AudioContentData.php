<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\DTO;

use DtRensuri\LaravelOpenrouter\Rules\AllowedValues;
use DtRensuri\LaravelOpenrouter\Types\AudioResponseFormatType;
use DtRensuri\LaravelOpenrouter\Types\AudioTimestampGranularityType;

final class AudioContentData extends DataTransferObject
{
    /**
     * {@inheritDoc}
     */
    public function __construct(
        /**
         * DTO of input audio.
         */
        public InputAudioData $input_audio,

        /**
         * STT model identifier, e.g. openai/whisper-large-v3.
         */
        public ?string $model = null,

        /**
         * ISO-639-1 language code (e.g., "en", "ja"). Auto-detected if omitted.
         */
        public ?string $language = null,

        /**
         * Output format. "json" (default) returns { text, usage }.
         * "verbose_json" additionally returns task, language, duration, and
         * segment-level timestamps; only supported by OpenAI-compatible providers.
         */
        #[AllowedValues([AudioResponseFormatType::JSON, AudioResponseFormatType::VERBOSE_JSON])]
        public ?string $response_format = null,

        /**
         * Sampling temperature for transcription.
         */
        public ?float $temperature = null,

        /**
         * Timestamp detail levels to include when response_format is
         * "verbose_json". "segment" returns segment-level timestamps; "word"
         * additionally returns word-level timestamps in the words array.
         * Ignored unless response_format is "verbose_json".
         *
         * @var string[]|null
         */
        #[AllowedValues([AudioTimestampGranularityType::SEGMENT, AudioTimestampGranularityType::WORD])]
        public ?array $timestamp_granularities = null,
    ) {
        parent::__construct(...func_get_args());
    }

    public function convertToArray(): array
    {
        return array_filter(
            [
                'input_audio' => $this->input_audio?->convertToArray(),
                'model' => $this->model,
                'language' => $this->language,
                'response_format' => $this->response_format,
                'temperature' => $this->temperature,
                'timestamp_granularities' => $this->timestamp_granularities,
            ],
            fn($value) => $value !== null
        );
    }
}
