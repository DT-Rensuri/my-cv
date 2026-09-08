<?php

use App\Http\Controllers\BraveSearchController;
use App\Http\Controllers\OpenRouterController;
use App\Http\Controllers\TtsLocalController;
use Illuminate\Support\Facades\Route;

Route::prefix('brave')->group(function () {
    Route::get('/search', [BraveSearchController::class, 'search']);
});

Route::prefix('openrouter')->group(function () {
    Route::post('/chat/completions', [OpenRouterController::class, 'chat']);
    Route::post('/audio/transcriptions', [OpenRouterController::class, 'transcription']);
});

Route::prefix('tts')->group(function () {
    Route::get('/voices', [TtsLocalController::class, 'voices']);
    Route::get('/stream', [TtsLocalController::class, 'stream']);
    Route::post('/stream', [TtsLocalController::class, 'stream']);
});
