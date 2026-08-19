<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property User $resource
 */
class TestTakerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var User $model */
        $model = $this->resource;

        return [
            'id' => $model->id,
            'name' => $model->name,
            'email' => $model->email,
            // count all tests for this test taker
            'tests' => $model->testAttempts()->distinct('test_id')->count('test_id'),
            // count all test attempts for this test taker
            'test_attempts' => $model->testAttempts()->count(),
            'last_test_attempt' => $model->testAttempts()->latest()->first()?->created_at,
        ];
    }
}