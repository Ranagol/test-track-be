<?php

namespace Database\Seeders;

use App\Models\AnswerOption;
use App\Models\Question;
use Illuminate\Database\Seeder;

class AnswerOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * We want every question to have 4 answer options, and exactly 1 of them should be correct.
     */
    public function run(): void
    {
        $questions = Question::all();

        foreach ($questions as $question) {

            // Create 3 default answer options with default is_correct = false
            AnswerOption::factory(3)->for($question)->create();

            // Create 1 correct answer option
            AnswerOption::factory()->for($question)->create([
                'is_correct' => true,
            ]);
        }
    }
}
