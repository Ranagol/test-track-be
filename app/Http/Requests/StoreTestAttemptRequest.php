<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestAttemptRequest extends FormRequest
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

            // TestAttempt fields
            'test_attempt.user_id' => 'required|integer|exists:users,id',
            'test_attempt.test_id' => 'required|integer|exists:tests,id',
            'test_attempt.comment' => 'nullable|string',
            'test_attempt.started_at' => 'nullable|date_format:Y-m-d H:i:s',
            'test_attempt.finished_at' => 'nullable|date_format:Y-m-d H:i:s',
            'test_attempt.completed_at' => 'nullable|date_format:Y-m-d H:i:s',

            // All UserAnswers from FE are collected into this array
            'user_answers' => 'required|array',

            'user_answers.*.question_id' => 'required|integer|exists:questions,id',
            'user_answers.*.answer_option_id' => 'required|integer|exists:answer_options,id',
            'user_answers.*.comment' => 'nullable|string',
        ];
    }
}
