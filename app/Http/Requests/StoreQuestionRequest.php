<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
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
            'test_id' => ['required', 'exists:tests,id'],
            'text' => ['required', 'string'],
            'image_path' => ['nullable', 'string', 'max:255'],
            'allows_multiple_correct' => ['boolean'],
            'question_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
