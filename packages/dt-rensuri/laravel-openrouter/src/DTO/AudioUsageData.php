<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter\DTO;

/**
 * AudioUsageData is the DTO for the usage info of the api call.
 */
final class AudioUsageData extends DataTransferObject
{
    /**
     * {@inheritDoc}
     */
    public function __construct(
        /**
         * Equivalent to "native_tokens_completion" in the /generation API
         */
        public ?int $input_tokens = null,

        /**
         * Equivalent to "native_tokens_prompt"
         */
        public ?int $output_tokens = null,

        /**
         * Sum of the above two fields ($input_tokens and $output_tokens)
         */
        public ?int $total_tokens = null,

        /**
         * Credit usage of the request
         */
        public ?float $cost = null,

        /**
         * Duration of the audio in seconds
         */
        public ?float $seconds = null,
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
                'input_tokens' => $this->input_tokens,
                'output_tokens' => $this->output_tokens,
                'total_tokens' => $this->total_tokens,
                'cost' => $this->cost,
                'seconds' => $this->seconds,
            ],
            fn($value) => $value !== null
        );
    }
}
