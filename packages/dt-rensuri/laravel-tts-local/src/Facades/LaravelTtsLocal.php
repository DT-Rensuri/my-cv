<?php

declare(strict_types=1);

namespace DtRensuri\LaravelTtsLocal\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array voices() Lists the available voices from the local TTS service.
 * @method static string synthesize(string $text, ?string $voice = null) Synthesizes the given text into audio and returns the raw WAV bytes.
 */
final class LaravelTtsLocal extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'laravel-tts-local';
    }
}
