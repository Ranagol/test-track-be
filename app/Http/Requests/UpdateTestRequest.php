<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTestRequest extends FormRequest
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
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'user_id' => ['required', 'exists:users,id'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.id' => ['required_with:questions', 'exists:questions,id'],
            'questions.*.text' => ['required_with:questions', 'string'],
            'questions.*.answer_options' => ['required_with:questions', 'array'],
            'questions.*.answer_options.*.id' => ['required_with:questions.*.answer_options', 'exists:answer_options,id'],
            'questions.*.answer_options.*.text' => ['required_with:questions.*.answer_options', 'string'],
            'questions.*.answer_options.*.is_correct' => ['required_with:questions.*.answer_options', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                // The normal rules already reject malformed question/option data.
                if ($validator->errors()->count() > 0) {
                    return;
                }

                foreach ($this->input('questions', []) as $questionIndex => $question) {
                    /** @var array<int, array{text: string, is_correct: bool}> $answerOptions */
                    $answerOptions = $question['answer_options'];

                    $correctAnswers = collect($answerOptions)
                        ->where('is_correct', true)
                        ->count();

                    if ($correctAnswers !== 1) {
                        $validator->errors()->add(
                            "questions.$questionIndex.answer_options",
                            'Exactly one answer option must be marked as correct.'
                        );
                    }
                }
            },
        ];
    }
}
