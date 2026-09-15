<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\DTO;

/**
 * AudioSegmentsData is a timestamped transcript segment, returned when
 * response_format is verbose_json.
 */
final class AudioSegmentsData extends DataTransferObject
{
    /**
     * {@inheritDoc}
     */
    public function __construct(
        /**
         * Segment index within the transcript.
         */
        public int $id,

        /**
         * Segment start time in seconds.
         */
        public float $start,

        /**
         * Segment end time in seconds.
         */
        public float $end,

        /**
         * Transcribed text of the segment.
         */
        public string $text,

        /**
         * Average log probability of the segment.
         */
        public ?float $avg_logprob = null,

        /**
         * Compression ratio of the segment.
         */
        public ?float $compression_ratio = null,

        /**
         * Probability the segment contains no speech.
         */
        public ?float $no_speech_prob = null,

        /**
         * Seek offset of the segment.
         */
        public ?int $seek = null,

        /**
         * Speaker index for the segment, present when the provider returns diarization data.
         */
        public ?int $speaker = null,

        /**
         * Temperature used for the segment.
         */
        public ?float $temperature = null,

        /**
         * Token IDs of the segment.
         *
         * @var int[]|null
         */
        public ?array $tokens = null,
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
                'id' => $this->id,
                'start' => $this->start,
                'end' => $this->end,
                'text' => $this->text,
                'avg_logprob' => $this->avg_logprob,
                'compression_ratio' => $this->compression_ratio,
                'no_speech_prob' => $this->no_speech_prob,
                'seek' => $this->seek,
                'speaker' => $this->speaker,
                'temperature' => $this->temperature,
                'tokens' => $this->tokens,
            ],
            fn($value) => $value !== null
        );
    }
}
