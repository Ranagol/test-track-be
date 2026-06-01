<?php

namespace App\Http\Requests;

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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'user_id' => ['required', 'exists:users,id'],
            'questions' => ['sometimes', 'array'],
            'questions.*.id' => ['required_with:questions', 'exists:questions,id'],
            'questions.*.text' => ['required_with:questions', 'string'],
            'questions.*.answer_options' => ['required_with:questions', 'array'],
            'questions.*.answer_options.*.id' => ['required_with:questions.*.answer_options', 'exists:answer_options,id'],
            'questions.*.answer_options.*.text' => ['required_with:questions.*.answer_options', 'string'],
            'questions.*.answer_options.*.is_correct' => ['required_with:questions.*.answer_options', 'boolean'],
        ];
    }
}
