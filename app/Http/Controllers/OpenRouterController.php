<?php

namespace App\Http\Controllers;

use App\Http\Requests\OpenRouter\ChatRequest;
use MoeMizrak\LaravelOpenrouter\DTO\ChatData;
use MoeMizrak\LaravelOpenrouter\DTO\ErrorData;
use MoeMizrak\LaravelOpenrouter\DTO\FunctionData;
use MoeMizrak\LaravelOpenrouter\DTO\MessageData;
use MoeMizrak\LaravelOpenrouter\DTO\ToolCallData;
use MoeMizrak\LaravelOpenrouter\OpenRouterRequest;
use MoeMizrak\LaravelOpenrouter\Types\RoleType;
use Illuminate\Support\Facades\File;

class OpenRouterController extends Controller
{
    public function chat(ChatRequest $request, OpenRouterRequest $openRouter)
    {
        $model = config('services.openrouter.model', 'gpt-4o-mini');
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
            ->map(fn (array $message) => new MessageData(
                role: $message['role'] ?? RoleType::USER,
                content: $message['content'],
                tool_calls: isset($message['tool_calls'])
                    ? collect($message['tool_calls'])->map(fn (array $tc) => new ToolCallData(
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
            ->map(fn (array $tool) => new ToolCallData(
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
            model: $model,
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
            return response()->json([
                'error' => [
                    'code' => $response->code,
                    'message' => $response->message,
                ],
            ], $response->code >= 400 && $response->code < 600 ? $response->code : 500);
        }

        return response()->json($response->toArray());
    }
}
