<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestRequest extends FormRequest
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
     * @return array<mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],

            'questions' => ['required', 'array', 'min:1'],
            'questions.*.text' => ['required', 'string'],
            'questions.*.answer_options' => ['required', 'array', 'min:2'],
            'questions.*.answer_options.*.text' => ['required', 'string'],
            'questions.*.answer_options.*.is_correct' => ['required', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator) {

                foreach ($this->questions as $questionIndex => $question) {

                    /** @var array<int, array{text: string, is_correct: bool}> $answerOptions */
                    $answerOptions = $question['answer_options'] ?? [];

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

    /**
     * The default Laravel validation error messages are precise, and utterly useless. Because they
     * are not user friendly. So we must create our own validation error messages. This is what we do
     * here.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a test title.',
            'description.required' => 'Please add a description.',

            'questions.required' => 'At least one question is required.',
            'questions.*.text.required' => 'Each question must have text.',

            'questions.*.answer_options.required' => 'Each question must have answers.',
            'questions.*.answer_options.min' => 'Each question must have at least 2 answers.',

            'questions.*.answer_options.*.text.required' => 'Each answer must have text.',
        ];
    }
}
