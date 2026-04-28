<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserAnswerRequest extends FormRequest
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
            'test_attempt_id' => ['required', 'integer', 'exists:test_attempts,id'],
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer_option_id' => ['required', 'integer', 'exists:answer_options,id'],
            'comment' => ['nullable', 'string'],
        ];
    }
}
