<?php

namespace Database\Seeders;

use App\Models\TestAttempt;
use App\Models\UserAnswer;
use Illuminate\Database\Seeder;

class UserAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // We will create user answers for the first test attempt of each test taker.
        $testAttempts = TestAttempt::all();

        foreach ($testAttempts as $testAttempt) {
            $test = $testAttempt->test;
            $questions = $test->questions;

            foreach ($questions as $question) {
                UserAnswer::factory()->create([
                    'test_attempt_id' => $testAttempt->id,
                    'question_id' => $question->id,
                    'answer_option_id' => $question->answerOptions()->inRandomOrder()->first()->id,
                ]);
            }
        }
    }
}
