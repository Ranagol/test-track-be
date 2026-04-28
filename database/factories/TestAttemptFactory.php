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
        $startedAt = $this->faker->dateTimeBetween('-30 days', 'now');
        /** @var \DateTime|null $finishedAt */
        $finishedAt = $this->faker->optional(0.7)->dateTimeBetween($startedAt, 'now');
        $completedAt = $finishedAt !== null ? $this->faker->optional(0.8)->dateTimeBetween($finishedAt, 'now') : null;

        return [
            'user_id' => User::factory(),
            'test_id' => Test::factory(),
            'score' => $this->faker->optional(0.7)->numberBetween(0, 100),
            'max_score' => $this->faker->optional(0.7)->numberBetween(60, 100),
            'comment' => $this->faker->optional(0.3)->sentence(),
            'started_at' => $startedAt,
            'finished_at' => $finishedAt,
            'completed_at' => $completedAt,
        ];
    }
}
