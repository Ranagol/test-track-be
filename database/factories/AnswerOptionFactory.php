<?php

namespace Database\Factories;

use App\Models\AnswerOption;
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
            /**
             * 'question_id' => 1, -> this is just a placeholder. AnswerOption will be always created
             * via Question, and that will give the proper question_id.
             */
            'question_id' => 1,
            'text' => $this->faker->sentence(5),
            'is_correct' => false,
            'answer_order' => null,
        ];
    }
}
