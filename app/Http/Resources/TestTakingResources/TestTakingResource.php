<?php

namespace App\Http\Resources\TestTakingResources;

use App\Http\Resources\TestAttemptResource;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Test $resource
 */
class TestTakingResource extends JsonResource
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
            'created_at' => $model->created_at ? $model->created_at->format('d.m.Y') : null,
            // 'updated_at' => $model->updated_at ? $model->updated_at->format('d.m.Y') : null,
            // Only include questions if they were already eager loaded in the controller.
            'questions' => TestTakingQuestionResource::collection($this->whenLoaded('questions')),
            'attempts' => TestAttemptResource::collection($this->whenLoaded('attempts')),
        ];
    }
}