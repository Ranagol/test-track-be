<?php

namespace App\Http\Resources;

use App\Models\TestAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property TestAttempt $resource
 */
class TestAttemptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var TestAttempt $model */
        $model = $this->resource;

        return [
            'id' => $model->id,
            'user_id' => $model->user_id,
            'test_id' => $model->test_id,
            'score_percentage' => round($model->score_percentage, 2),
            'comment' => $model->comment,
            'started_at' => $model->started_at,
            'completed_at' => $model->completed_at,
            'created_at' => $model->created_at ? $model->created_at->format('d.m.Y') : null,
            'updated_at' => $model->updated_at ? $model->updated_at->format('d.m.Y') : null,

            // Only include test if it was already eager loaded in the controller.
            'test' => new TestResource($this->whenLoaded('test')),
            'user' => new UserResource($this->whenLoaded('user')),
            'userAnswers' => UserAnswerResource::collection($this->whenLoaded('userAnswers')),

        ];
    }
}