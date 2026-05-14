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
            'score_percentage' => $this->faker->randomFloat(2, 0, 100),
            'comment' => $this->faker->sentence(),
            'started_at' => now()->subHour(),
            'completed_at' => now(),
        ];
    }
}