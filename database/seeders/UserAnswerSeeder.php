<?php

namespace Database\Seeders;

use App\Interfaces\TestAttemptEvaluatorInterface;
use App\Models\TestAttempt;
use App\Models\UserAnswer;
use Illuminate\Database\Seeder;

class UserAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(TestAttemptEvaluatorInterface $evaluator): void
    {
        $testAttempts = TestAttempt::with('test.questions.answerOptions')->get();

        foreach ($testAttempts as $testAttempt) {

            foreach ($testAttempt->test->questions as $question) {
                UserAnswer::factory()->create([
                    'test_attempt_id' => $testAttempt->id,
                    'question_id' => $question->id,
                    'answer_option_id' => $question->answerOptions->random()->id,
                ]);
            }

            // Re-load testAttempt with userAnswers, because we need them for evaluation.
            $testAttempt->load('userAnswers');
            // Evaluate and score testAttempt
            $evaluator->evaluate($testAttempt);

        }
    }
}