<?php

namespace App\Http\Requests\TtsLocal;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StreamRequest extends FormRequest
{
    const MAX_TEXT_LENGTH = 5000;

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
            'text' => ['required', 'string', 'max:'.self::MAX_TEXT_LENGTH],
            'voice' => ['nullable', 'string', 'max:100'],
        ];
    }
}
