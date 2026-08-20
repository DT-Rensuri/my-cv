<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\DTO;

/**
 * AudioWordData is a timestamped word, returned when the provider includes
 * word-level timestamps.
 */
final class AudioWordData extends DataTransferObject
{
    /**
     * {@inheritDoc}
     */
    public function __construct(
        /**
         * The transcribed word.
         */
        public string $word,

        /**
         * Word start time in seconds.
         */
        public float $start,

        /**
         * Word end time in seconds.
         */
        public float $end,

        /**
         * Speaker index for the word, present when the provider returns diarization data.
         */
        public ?int $speaker = null,
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
                'word' => $this->word,
                'start' => $this->start,
                'end' => $this->end,
                'speaker' => $this->speaker,
            ],
            fn($value) => $value !== null
        );
    }
}