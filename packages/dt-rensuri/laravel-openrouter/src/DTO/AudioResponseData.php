<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\DTO;

/**
 * AudioResponseData is the STT response DTO which consists of:
 * - text
 * - duration
 * - language
 * - task
 * - segments (DTO object)
 * - words (DTO object)
 * - usage (DTO object)
 */
final class AudioResponseData extends DataTransferObject
{
    /**
     * {@inheritDoc}
     */
    public function __construct(
        /**
         * The transcribed text.
         */
        public string $text,

        /**
         * Duration of the input audio in seconds, present when response_format is verbose_json.
         */
        public ?float $duration = null,

        /**
         * Detected or forced language, present when response_format is verbose_json.
         */
        public ?string $language = null,

        /**
         * The task performed, present when response_format is verbose_json.
         */
        public ?string $task = null,

        /**
         * Timestamped transcript segments, present when response_format is verbose_json.
         *
         * @var AudioSegmentsData[]|null
         */
        public ?array $segments = null,

        /**
         * Timestamped words, present when the provider returns word-level timestamps.
         *
         * @var AudioWordData[]|null
         */
        public ?array $words = null,

        /**
         * Usage information of api request.
         */
        public ?AudioUsageData $usage = null,
    ) {
        parent::__construct(...func_get_args());
    }

    /**
     * {@inheritDoc}
     */
    public function toArray(): array
    {
        return array_filter(
            [
                'text' => $this->text,
                'duration' => $this->duration,
                'language' => $this->language,
                'task' => $this->task,
                'segments' => ! is_null($this->segments)
                    ? array_map(fn(AudioSegmentsData $segment) => $segment->toArray(), $this->segments)
                    : null,
                'words' => ! is_null($this->words)
                    ? array_map(fn(AudioWordData $word) => $word->toArray(), $this->words)
                    : null,
                'usage' => $this->usage?->toArray(),
            ],
            fn($value) => $value !== null
        );
    }
}
