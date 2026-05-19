<?php

namespace App\Http\Resources;

use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Test $resource
 */
class TestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Test $model */
        $model = $this->resource;

        return [
            'id' => $model->id,
            'user_id' => $model->user_id,
            'title' => $model->title,
            'description' => $model->description,
            'test_code' => $model->test_code,
            // Only include questions if they were already eager loaded in the controller.
            'questions' => QuestionResource::collection($this->whenLoaded('questions')),
            'created_at' => $model->created_at ? $model->created_at->format('d.m.Y') : null,
            'updated_at' => $model->updated_at ? $model->updated_at->format('d.m.Y') : null,
        ];
    }
}
