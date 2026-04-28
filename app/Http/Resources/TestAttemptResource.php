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
            'score' => $model->score,
            'max_score' => $model->max_score,
            'comment' => $model->comment,
            'started_at' => $model->started_at,
            'finished_at' => $model->finished_at,
            'completed_at' => $model->completed_at,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }
}
