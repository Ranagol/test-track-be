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
            'user_id' => ['required', 'exists:users,id'],
            'test_id' => ['required', 'exists:tests,id'],
            'score' => ['nullable', 'integer', 'min:0'],
            'max_score' => ['nullable', 'integer', 'min:0'],
            'comment' => ['nullable', 'string'],
            'started_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'finished_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'completed_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
        ];
    }
}
