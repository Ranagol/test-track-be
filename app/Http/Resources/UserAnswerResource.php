<?php

namespace App\Http\Resources;

use App\Models\UserAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @mixin UserAnswer
 *
 * @property int $id
 * @property int $test_attempt_id
 * @property int $question_id
 * @property int $answer_option_id
 * @property string|null $comment
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class UserAnswerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'test_attempt_id' => $this->test_attempt_id,
            'question_id' => $this->question_id,
            'answer_option_id' => $this->answer_option_id,
            'selected_answer_option' => new AnswerOptionResource($this->whenLoaded('answerOption')),
        ];
    }
}
