<?php

namespace App\Http\Requests\Reports;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReportApplicationBugRquest extends FormRequest
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
            'source' => ['required', 'string', 'max:255'],
            'error' => ['required', 'string'],
            'stackTrace' => ['required', 'string'],
            'timestamp' => ['required', 'date'],
            'platform' => ['required', 'string', 'in:android,ios,fuchsia,linux,macos,windows,web']
        ];
    }
}
