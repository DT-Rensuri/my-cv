<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\BraveService;

class BraveServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(BraveService::class, function ($app) {
            return new BraveService(config('services.brave.api_key'));
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
