<?php

namespace App\Http\Requests\OpenRouter;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use DtRensuri\LaravelOpenrouter\Types\AudioFormatType;
use DtRensuri\LaravelOpenrouter\Types\AudioResponseFormatType;
use DtRensuri\LaravelOpenrouter\Types\AudioTimestampGranularityType;
use Override;

class AudioRequest extends FormRequest
{
    const MAX_AUDIO_SIZE_KB = 25600; // 25 MB
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
        $allowedAudioFormats = implode(',', AudioFormatType::getAllowedValues());
        $allowedResponseFormats = implode(',', AudioResponseFormatType::getAllowedValues());
        $allowedGranularities = implode(',', AudioTimestampGranularityType::getAllowedValues());
        return [
            'audio_data' => [
                'required',
                'file',
                'max:' . self::MAX_AUDIO_SIZE_KB,
                'mimes:webm,wav,mp3,flac,m4a,ogg,aac',
            ],
            'audio_format' => ["required", 'string', "in:{$allowedAudioFormats}"],
            'language' => ['nullable', 'string', 'size:2'],
            'response_format' => ["nullable", 'string', "in:{$allowedResponseFormats}"],
            'temperature' => ['nullable', 'numeric', 'min:0', 'max:2'],
            'timestamp_granularities' => ['nullable', 'array'],
            'timestamp_granularities.*' => ["string", "in:{$allowedGranularities}"],
        ];
    }
}
