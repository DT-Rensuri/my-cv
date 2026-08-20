<?php

namespace App\Http\Controllers;

use App\Http\Requests\OpenRouter\ChatRequest;
use DtRensuri\LaravelOpenrouter\DTO\ChatData;
use DtRensuri\LaravelOpenrouter\DTO\ErrorData;
use DtRensuri\LaravelOpenrouter\DTO\FunctionData;
use DtRensuri\LaravelOpenrouter\DTO\MessageData;
use DtRensuri\LaravelOpenrouter\DTO\ToolCallData;
use DtRensuri\LaravelOpenrouter\DTO\InputAudioData;
use DtRensuri\LaravelOpenrouter\DTO\AudioContentData;
use DtRensuri\LaravelOpenrouter\DTO\AudioResponseData;
use DtRensuri\LaravelOpenrouter\OpenRouterRequest;
use DtRensuri\LaravelOpenrouter\Types\RoleType;
use App\Http\Requests\OpenRouter\AudioRequest;
use Illuminate\Support\Facades\File;
use App\Support\ApiResponseBuilder;

class OpenRouterController extends Controller
{
    private string $assistanceModel;
    private string $audioModel;

    public function __construct()
    {
        $this->assistanceModel = config('services.openrouter.model', 'gpt-4o-mini');
        $this->audioModel = config('services.openrouter.audio_model', 'whisper');
    }

    public function chat(ChatRequest $request, OpenRouterRequest $openRouter)
    {
        $sysPromptPath = storage_path('app/prompts/SYSTEM.md');
        $prompt = File::exists($sysPromptPath)
            ? File::get($sysPromptPath)
            : 'You are ``Suri`` a helpful assistant.';

        $messages = [
            new MessageData(
                role: RoleType::SYSTEM,
                content: $prompt,
            )
        ];

        $messages = array_merge($messages, collect($request->input('messages', []))
            ->map(fn(array $message) => new MessageData(
                role: $message['role'] ?? RoleType::USER,
                content: $message['content'],
                tool_calls: isset($message['tool_calls'])
                    ? collect($message['tool_calls'])->map(fn(array $tc) => new ToolCallData(
                        id: $tc['id'] ?? null,
                        type: $tc['type'] ?? 'function',
                        function: isset($tc['function'])
                            ? new FunctionData(
                                name: $tc['function']['name'] ?? '',
                                arguments: $tc['function']['arguments'] ?? null,
                            )
                            : null,
                    ))->all()
                    : null,
                tool_call_id: $message['tool_call_id'] ?? null,
            ))
            ->all());

        // Forward tool definitions (OpenAI format) so the model can call tools.
        $tools = collect($request->input('tools', []))
            ->map(fn(array $tool) => new ToolCallData(
                type: $tool['type'] ?? 'function',
                function: isset($tool['function'])
                    ? new FunctionData(
                        name: $tool['function']['name'] ?? '',
                        description: $tool['function']['description'] ?? null,
                        parameters: $tool['function']['parameters'] ?? null,
                    )
                    : null,
            ))
            ->all();

        $chatData = new ChatData(
            messages: $messages,
            model: $this->assistanceModel,
            stream: $request->boolean('stream') ? true : null,
            temperature: $request->float('temperature') ?: null,
            max_tokens: $request->integer('max_tokens') ?: null,
            tools: $tools ?: null,
            tool_choice: $request->input('tool_choice'),
        );

        // Stream pass-through: forward the SSE stream back to the client.
        if ($request->boolean('stream')) {
            $stream = $openRouter->chatStreamRequest($chatData)->wait();

            return response()->stream(function () use ($stream) {
                while (! $stream->eof()) {
                    $chunk = $stream->read(1024);
                    if ($chunk === '') {
                        break;
                    }
                    echo $chunk;
                    @ob_flush();
                    flush();
                }
            }, 200, [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache',
                'X-Accel-Buffering' => 'no',
            ]);
        }

        $response = $openRouter->chatRequest($chatData);

        if ($response instanceof ErrorData) {
            return ApiResponseBuilder::error($response->message, $response->code, $response->metadata);
        }

        return response()->json($response->toArray());
    }

    public function transcription(AudioRequest $request, OpenRouterRequest $openRouter)
    {
        $audioData = $request->file('audio_data');
        $audioFormat = $request->input('audio_format');

        $audioBase64 = base64_encode(file_get_contents($audioData->getRealPath()));

        $audioContentData = new AudioContentData(
            input_audio: new InputAudioData(
                data: $audioBase64,
                format: $audioFormat,
            ),
            model: $this->audioModel,
            language: $request->input('language'),
            response_format: $request->input('response_format'),
            temperature: $request->float('temperature') ?: null,
            timestamp_granularities: $request->input('timestamp_granularities'),
        );

        $response = $openRouter->audioRequest($audioContentData);

        if ($response instanceof ErrorData) {
            return ApiResponseBuilder::error($response->message, $response->code, $response->metadata);
        }

        return ApiResponseBuilder::success([
            'text' => $response->text
        ]);
    }
}
