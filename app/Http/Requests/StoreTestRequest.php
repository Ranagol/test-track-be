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
            'user_id' => ['required', 'exists:users,id'],

            'questions' => ['required', 'array', 'min:1'],
            'questions.*.text' => ['required', 'string'],
            'questions.*.answer_options' => ['required', 'array', 'min:2'],
            'questions.*.answer_options.*.text' => ['required', 'string'],
            'questions.*.answer_options.*.is_correct' => ['required', 'boolean'],
        ];
    }

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
