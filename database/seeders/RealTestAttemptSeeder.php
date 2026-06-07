<?php

namespace Database\Seeders;

use App\Interfaces\TestAttemptEvaluatorInterface;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * In order to be able to demonstrate the longitudinal analytics possibilities of this app (which is
 * the absolut core function), we must have meaningful tests with real questions and answer options
 * (created in RealTestSeeder) and real user TestAttempts. This latter will be created in this class.
 */
class RealTestAttemptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(TestAttemptEvaluatorInterface $evaluator): void
    {
        $tester = User::role('tester')->where('email', config('app.DEFAULT_TESTER_EMAIL'))->first();
        $testTaker = User::role('test-taker')->where('email', config('app.DEFAULT_TEST_TAKER_EMAIL'))->first();

        // These two tests are meaningful, concrete tests.
        $tests = $tester->createdTests()
            ->whereIn('title', ['Math test', 'Literature test'])
            ->get();

        foreach ($tests as $test) {

            /**
             * Here we create a TestAttempt with 33% of success. First answer is correct, the other
             * two answers are wrong.
             */
            $testAttempt1 = $testTaker->testAttempts()->create([
                'test_id' => $test->id,
                'comment' => 'Created by RealTestAttemptSeeder',
                'created_at' => now()->subDays(5),
            ]);

            for ($questionIndex = 0; $questionIndex < $test->questions->count(); $questionIndex++) {
                $question = $test->questions[$questionIndex];

                if ($questionIndex === 0) {
                    // For the first question, we create a correct answer.
                    $testAttempt1->userAnswers()->create([
                        'question_id' => $question->id,
                        'answer_option_id' => $this->createCorrectAnswerOptionId($question),
                    ]);

                    continue;
                }
                // For all other questions we create wrong answers.
                $testAttempt1->userAnswers()->create([
                    'question_id' => $question->id,
                    'answer_option_id' => $this->createWrongAnswerOptionId($question),
                ]);
            }
            // Evaluate and score testAttempt1
            $evaluator->evaluate($testAttempt1);

            /**
             * Here we create a TestAttempt with 66% of success. First two answers are correct, the
             * last answer is wrong.
             */
            $testAttempt2 = $testTaker->testAttempts()->create([
                'test_id' => $test->id,
                'comment' => 'Created by RealTestAttemptSeeder',
            ]);

            for ($questionIndex = 0; $questionIndex < $test->questions->count(); $questionIndex++) {
                $question = $test->questions[$questionIndex];

                if ($questionIndex < 2) {
                    // For the first two questions, we create correct answers.
                    $testAttempt2->userAnswers()->create([
                        'question_id' => $question->id,
                        'answer_option_id' => $this->createCorrectAnswerOptionId($question),
                    ]);

                    continue;
                }
                // For the last question we create a wrong answer.
                $testAttempt2->userAnswers()->create([
                    'question_id' => $question->id,
                    'answer_option_id' => $this->createWrongAnswerOptionId($question),
                ]);
            }
            // Evaluate and score testAttempt2
            $evaluator->evaluate($testAttempt2);
        }
    }

    private function createCorrectAnswerOptionId(Question $question): int
    {
        return $question->answerOptions()->where('is_correct', true)->first()->id;
    }

    private function createWrongAnswerOptionId(Question $question): int
    {
        return $question->answerOptions()->where('is_correct', false)->first()->id;
    }
}