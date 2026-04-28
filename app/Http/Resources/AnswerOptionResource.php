<?php

namespace App\Http\Resources;

use App\Models\AnswerOption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property AnswerOption $resource
 */
class AnswerOptionResource extends JsonResource
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

        return [
            'id' => $model->id,
            'question_id' => $model->question_id,
            'text' => $model->text,
            'is_correct' => $model->is_correct,
            'answer_order' => $model->answer_order,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }
}
