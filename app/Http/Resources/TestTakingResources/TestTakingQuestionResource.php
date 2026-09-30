<?php

namespace App\Http\Resources\TestTakingResources;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Question $resource
 */
class TestTakingQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * 'correct_answer_text' -- this is deliberately excluded. When taking tests,
     * we should not sending the correct answer to the client.
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
            'answer_options' => TestTakingAnswerOptionResource::collection($this->whenLoaded('answerOptions')),
        ];
    }
}
