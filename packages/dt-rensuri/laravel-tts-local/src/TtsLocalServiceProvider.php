<?php

declare(strict_types=1);

namespace DtRensuri\LaravelTtsLocal;

use DtRensuri\LaravelTtsLocal\Facades\LaravelTtsLocal;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleRetry\GuzzleRetryMiddleware;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;

final class TtsLocalServiceProvider extends ServiceProvider
{
    /**
     * The default timeout for the Guzzle client.
     */
    const DEFAULT_TIMEOUT = 60;

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPublishing();
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->configure();

        $this->app->singleton('laravel-tts-local.http', function () {
            return $this->configureClient();
        });

        $this->app->bind('laravel-tts-local', function () {
            return new TtsLocalRequest(
                $this->app->make('laravel-tts-local.http'),
            );
        });

        $this->app->bind(TtsLocalRequest::class, function () {
            return $this->app->make('laravel-tts-local');
        });

        // Register the facade alias.
        AliasLoader::getInstance()->alias('LaravelTtsLocal', LaravelTtsLocal::class);
    }

    /**
     * Get the services provided by the provider.
     */
    public function provides(): array
    {
        return ['laravel-tts-local'];
    }

    /**
     * Setup the configuration.
     */
    protected function configure(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/laravel-tts-local.php', 'laravel-tts-local'
        );
    }

    /**
     * Register the package's publishable resources.
     */
    protected function registerPublishing(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/laravel-tts-local.php' => config_path('laravel-tts-local.php'),
            ], 'laravel-tts-local');
        }
    }

    /**
     * Configure the Guzzle client.
     */
    private function configureClient(): Client
    {
        // Set the default configuration for retrying requests
        $retryOptions = [
            'max_retry_attempts' => 3,
            'retry_on_status' => [429, 500, 502, 503, 504],
            'retry_on_timeout' => true,
        ];

        // Create a handler stack with the retry middleware.
        $handlerStack = HandlerStack::create();

        // Add the retry middleware to the handler stack.
        $handlerStack->push(GuzzleRetryMiddleware::factory($retryOptions));

        /*
         * Create and return a Guzzle client with the base_uri, timeout and handler stack request options.
         */
        return new Client([
            'base_uri' => config('laravel-tts-local.base_url'),
            'timeout' => config('laravel-tts-local.timeout', self::DEFAULT_TIMEOUT),
            'handler' => $handlerStack,
        ]);
    }
}
