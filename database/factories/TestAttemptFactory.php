<?php

namespace Database\Factories;

use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TestAttempt>
 */
class TestAttemptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'test_id' => Test::factory(),
            // score_percentage and comment are deliberately null, these will be filled by the Evaluator
            'score_percentage' => null,
            'comment' => null,
            'started_at' => now()->subHour(),
            'completed_at' => now(),
        ];
    }
}