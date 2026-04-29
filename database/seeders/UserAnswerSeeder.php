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
        $testAttempts = TestAttempt::with('test.questions')->get();

        foreach ($testAttempts as $testAttempt) {

            foreach ($testAttempt->test->questions as $question) {
                UserAnswer::factory()->create([
                    'test_attempt_id' => $testAttempt->id,
                    'question_id' => $question->id,
                    'answer_option_id' => $question->answerOptions()->inRandomOrder()->first()->id,
                ]);
            }
        }
    }
}
