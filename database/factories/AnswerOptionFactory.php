<?php

namespace Database\Factories;

use App\Models\AnswerOption;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AnswerOption>
 */
class AnswerOptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'text' => $this->faker->sentence(5),
            'is_correct' => false,
            'answer_order' => null,
        ];
    }
}
