<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('brave')->group(function () {
    Route::get('/search', [\App\Http\Controllers\BraveSearchController::class, 'search']);
});

Route::prefix('openrouter')->group(function () {
    Route::post('/chat/completions', [\App\Http\Controllers\OpenRouterController::class, 'chat']);
    Route::post('/audio/transcriptions', [\App\Http\Controllers\OpenRouterController::class, 'transcription']);
});