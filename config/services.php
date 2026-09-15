<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'brave' => [
        'api_key' => env('BRAVE_API_KEY'),
    ],

    'openrouter' => [
        // Server-side key ONLY. NEVER expose this to the frontend.
        'api_key' => env('OPENROUTER_API_KEY'),
        'model' => env('OPENROUTER_MODEL', 'gpt-4o-mini'), // Default model if not provided
        'audio_model' => env('OPENROUTER_AUDIO_MODEL', 'whisper'), // Default audio model if not provided
        'suri_model' => env('OPENROUTER_SURI_MODEL', 'liquid/lfm-2.5-2.6b:free'), // Default Suri model if not provided
    ],

    'tts_local' => [
        // Local TTS (Vieneu / FastAPI) service. See services/tts/main.py.
        'base_url' => env('TTS_LOCAL_BASE_URL', 'http://127.0.0.1:8001'),
        'timeout' => env('TTS_LOCAL_TIMEOUT', 60),
        'default_voice' => env('TTS_LOCAL_DEFAULT_VOICE', 'my-custom-voice'),
    ],
];
