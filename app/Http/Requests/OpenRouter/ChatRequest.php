<?php

namespace App\Http\Requests\OpenRouter;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class ChatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'model' => ['required', 'in:default,voice-meeting-ai,suri-vtube'],
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.role' => ['required', 'string', 'in:system,user,assistant,tool'],
            'messages.*.content' => ['nullable'],
            'messages.*.tool_calls' => ['nullable', 'array'],
            'messages.*.tool_call_id' => ['nullable', 'string'],
            'tools' => ['nullable', 'array'],
            'tools.*.type' => ['nullable', 'string'],
            'tools.*.function.name' => ['required_with:tools', 'string'],
            'tools.*.function.description' => ['nullable', 'string'],
            'tools.*.function.parameters' => ['nullable', 'array'],
            'tool_choice' => ['nullable', 'string'],
            'stream' => ['nullable', 'boolean'],
            'temperature' => ['nullable', 'numeric'],
            'max_tokens' => ['nullable', 'integer'],
        ];
    }

    function getDefaultSystemPrompt(): string
    {
        $sysPromptPath = storage_path('app/prompts/SYSTEM.md');
        return file_exists($sysPromptPath)
            ? file_get_contents($sysPromptPath)
            : 'You are ``Suri`` a helpful assistant.';
    }

    function getVoiceMeetingSystemPrompt(): string
    {
        $sysPromptPath = storage_path('app/prompts/VOICE_MEETING.md');
        return file_exists($sysPromptPath)
            ? file_get_contents($sysPromptPath)
            : 'You are ``Suri`` a helpful assistant.';
    }


    function getSuriVTubeSystemPrompt(): string
    {
        $sysPromptPath = storage_path('app/prompts/SURI_VTUBE.md');
        return file_exists($sysPromptPath)
            ? file_get_contents($sysPromptPath)
            : 'You are ``Suri`` a helpful assistant.';
    }

    public function getSystemPrompt(): string
    {
        $model = $this->input('model', 'default');
        return match ($model) {
            'voice-meeting-ai' => $this->getVoiceMeetingSystemPrompt(),
            'suri-vtube' => $this->getSuriVTubeSystemPrompt(),
            default => $this->getDefaultSystemPrompt(),
        };
    }

    public function getThinkingEffort(): string
    {
        $model = $this->input('model', 'default');
        return match ($model) {
            'voice-meeting-ai' => 'medium',
            'suri-vtube' => 'medium',
            default => 'medium',
        };
    }
}
