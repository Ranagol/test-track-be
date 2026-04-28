<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserAnswerRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'test_attempt_id' => ['sometimes', 'integer', 'exists:test_attempts,id'],
            'question_id' => ['sometimes', 'integer', 'exists:questions,id'],
            'answer_option_id' => ['sometimes', 'integer', 'exists:answer_options,id'],
            'comment' => ['nullable', 'string'],
        ];
    }
}
