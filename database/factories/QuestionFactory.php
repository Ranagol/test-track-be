<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Test;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'test_id' => Test::factory(),
            'text' => $this->faker->paragraph(),
            'image_path' => null,
            'allows_multiple_correct' => false,
            'question_order' => null,
        ];
    }
}
