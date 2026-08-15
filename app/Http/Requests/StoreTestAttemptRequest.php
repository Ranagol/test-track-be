<?php

namespace App\Http\Requests;

use App\Models\Test;
use Illuminate\Contracts\Validation\Validator;
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

    /**
     * Here we want to check the completness of the users answers. It may happen that the test has
     * 10 question, but the user only answered 5, he forgot the rest. So, when he clicks 'submit'
     * this validator will be triggered, it will notice the problem, and will send back a validation
     * error feedback.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            $testId = $this->input('test_attempt.test_id');

            if (! $testId) {
                $validator->errors()->add('test_attempt.test_id', 'Missing test ID.');

                return;
            }

            $test = Test::find($testId);

            if (! $test) {
                $validator->errors()->add('test_attempt.test_id', 'Invalid test ID.');

                return;
            }

            $expectedIds = $test->questions()->pluck('id');

            $receivedIds = collect($this->input('user_answers', []))
                ->pluck('question_id')
                ->unique();

            $missing = $expectedIds->diff($receivedIds);

            if ($missing->isNotEmpty()) {
                $validator->errors()->add(
                    'user_answers',
                    'Answers are missing. Please answer all questions before submitting.'
                );
            }
        });
    }
}
