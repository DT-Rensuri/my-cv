<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home')->name('home');
Route::prefix('projects')->group(function () {
    Route::inertia('/ai-recorder', 'Projects/AIMettingVoiceRecorder')->name('projects.ai-meeting-voice-recorder');
    Route::inertia('/suri-v-tube', 'Projects/SuriVTube')->name('projects.suri-v-tube');
});