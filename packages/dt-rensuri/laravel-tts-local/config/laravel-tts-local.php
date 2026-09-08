<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | TTS Local Base URL
    |--------------------------------------------------------------------------
    |
    | Base URL of the local TTS (Vieneu / FastAPI) service.
    | Default value is http://127.0.0.1:8001 which matches the uvicorn
    | server defined in services/tts/main.py.
    |
    */
    'base_url' => env('TTS_LOCAL_BASE_URL', 'http://127.0.0.1:8001'),

    /*
    |--------------------------------------------------------------------------
    | TTS Local Timeout
    |--------------------------------------------------------------------------
    |
    | Request timeout in seconds. Increase if the local model is slow to
    | synthesize longer texts.
    |
    */
    'timeout' => env('TTS_LOCAL_TIMEOUT', 60),

    /*
    |--------------------------------------------------------------------------
    | TTS Local Default Voice
    |--------------------------------------------------------------------------
    |
    | Default voice id used when no voice is provided. The local service
    | registers a custom voice named "my-custom-voice".
    |
    */
    'default_voice' => env('TTS_LOCAL_DEFAULT_VOICE', 'my-custom-voice'),
];
