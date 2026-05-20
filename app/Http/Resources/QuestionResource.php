<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Question $resource
 */
class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Question $model */
        $model = $this->resource;

        return [
            'id' => $model->id,
            'test_id' => $model->test_id,
            'text' => $model->text,
            'answer_options' => AnswerOptionResource::collection($this->whenLoaded('answerOptions')),
            'correct_answer_text' => $this->whenLoaded('correctAnswerText', function () {
                return $this->correctAnswerText ? $this->correctAnswerText->text : null;
            }),

        ];
    }
}
