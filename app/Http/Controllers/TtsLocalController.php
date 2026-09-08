<?php

namespace App\Http\Controllers;

use App\Http\Requests\TtsLocal\StreamRequest;
use App\Support\ApiResponseBuilder;
use DtRensuri\LaravelTtsLocal\TtsLocalRequest;

class TtsLocalController extends Controller
{
    private string $defaultVoice;

    public function __construct()
    {
        $this->defaultVoice = config('services.tts_local.default_voice', 'my-custom-voice');
    }

    /**
     * Lists the available voices from the local TTS service.
     */
    public function voices(TtsLocalRequest $tts)
    {
        $voices = $tts->voices();

        return ApiResponseBuilder::success($voices);
    }

    /**
     * Synthesizes the given text and streams the WAV back to the client
     * chunk-by-chunk, preserving the streaming behavior of the local TTS
     * service (no full buffering in memory).
     */
    public function stream(StreamRequest $request, TtsLocalRequest $tts)
    {
        $text = $request->input('text');
        $voice = $request->input('voice') ?: $this->defaultVoice;

        $upstream = $tts->streamSynthesize($text, $voice);
        $body = $upstream->getBody();

        return response()->stream(function () use ($body) {
            // Đọc và đẩy từng chunk ngay khi FastAPI sinh audio — giữ TTFA
            // thấp thay vì đợi toàn bộ body về mới echo.
            while (! $body->eof()) {
                $chunk = $body->read(8192);

                if ($chunk === '') {
                    break;
                }

                echo $chunk;

                if (ob_get_level() > 0) {
                    ob_flush();
                }

                flush();
            }
        }, 200, [
            'Content-Type' => 'audio/wav',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
