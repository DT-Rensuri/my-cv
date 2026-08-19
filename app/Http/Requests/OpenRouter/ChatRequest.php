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
            'model' => ['nullable', 'string'],
            'stream' => ['nullable', 'boolean'],
            'temperature' => ['nullable', 'numeric'],
            'max_tokens' => ['nullable', 'integer'],
        ];
    }
}
