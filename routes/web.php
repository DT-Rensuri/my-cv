<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home')->name('home');
Route::prefix('projects')->group(function () {
    Route::inertia('/', 'Projects/AIMettingVoiceRecorder')->name('projects.ai-meeting-voice-recorder');
});