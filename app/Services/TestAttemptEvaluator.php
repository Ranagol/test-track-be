<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\TestAttemptEvaluatorInterface;
use App\Models\TestAttempt;

class TestAttemptEvaluator implements TestAttemptEvaluatorInterface
{
    /**
     * Every time a user solves a test, a new TestAttempt is created for him in the db. This TestAttempt
     * must be evaluated, must be checked if the users answers were correct, how many of them were
     * correct... This function does exactly that.
     */
    public function evaluate(TestAttempt $testAttempt): void
    {
        $test = $testAttempt->test->load('questions.correctAnswerId');
        $numberOfQuestions = $test->numberOfQuestions();
        $numberOfCorrectAnswers = 0;

        foreach ($testAttempt->userAnswers as $userAnswer) {

            $question = $test->questions->firstWhere('id', $userAnswer->question_id);

            $correctAnswerId = $question->correctAnswerId?->id;

            $userAnswerId = $userAnswer->answer_option_id;

            /**
             * $isCorrect will became a bool. If it is true, we raise the number of correct answers,
             * and we set the is_correct to true.
             * If it is false, we set the is_correct to false.
             */
            $isCorrect = $correctAnswerId === $userAnswerId;

            if ($isCorrect) {
                $numberOfCorrectAnswers++;
            }

            $userAnswer->update(['is_correct' => $isCorrect]);
        }

        $successPercentage = $numberOfCorrectAnswers / $numberOfQuestions * 100;

        $testAttempt->update([
            'score_percentage' => $successPercentage,
        ]);
    }
}