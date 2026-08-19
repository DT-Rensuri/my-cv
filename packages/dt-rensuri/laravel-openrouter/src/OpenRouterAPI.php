<?php

declare(strict_types=1);

namespace DtRensuri\LaravelOpenrouter;

use DtRensuri\LaravelOpenrouter\Helpers\OpenRouterHelper;

/**
 * This abstract class forms the response from OpenRouter
 */
abstract class OpenRouterAPI
{
    public function __construct(
        protected OpenRouterHelper $openRouterHelper,
    ) {}
}
