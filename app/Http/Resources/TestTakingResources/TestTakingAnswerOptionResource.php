<?php

namespace App\Http\Resources\TestTakingResources;

use App\Models\AnswerOption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property AnswerOption $resource
 */
class TestTakingAnswerOptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var AnswerOption $model */
        $model = $this->resource;

        /**
         * 'is_correct' => $model->is_correct, -- this is deliberately excluded. When taking tests,
         * we should not sending the correct answer to the client.
         */
        return [
            'id' => $model->id,
            'question_id' => $model->question_id,
            'text' => $model->text,
        ];
    }
}
