<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnswerOptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string|string[]>
     */
    public function rules(): array
    {
        return [
            'text' => ['sometimes', 'string', 'max:255'],
            'is_correct' => ['sometimes', 'boolean'],
        ];
    }
}
