<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
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
            'test_id' => ['sometimes', 'exists:tests,id'],
            'text' => ['sometimes', 'string'],
            'image_path' => ['nullable', 'string', 'max:255'],
            'allows_multiple_correct' => ['boolean'],
            'question_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
