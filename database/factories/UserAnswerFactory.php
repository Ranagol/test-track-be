<?php

namespace Database\Factories;

use App\Models\AnswerOption;
use App\Models\Question;
use App\Models\TestAttempt;
use App\Models\UserAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserAnswer>
 */
class UserAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'test_attempt_id' => TestAttempt::factory(),
            'question_id' => Question::factory(),
            'answer_option_id' => AnswerOption::factory(),
            'comment' => $this->faker->optional()->sentence(),
        ];
    }
}
