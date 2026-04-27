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
            'image_path' => $model->image_path,
            'allows_multiple_correct' => $model->allows_multiple_correct,
            'question_order' => $model->question_order,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }
}
