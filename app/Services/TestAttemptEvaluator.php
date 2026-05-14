<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\TestAttempt;

class TestAttemptEvaluator
{
    public function evaluate(TestAttempt $testAttempt): void
    {
        $test = $testAttempt->test->load('questions.correctAnswerId,numberOfQuestions');
        $numberOfQuestions = $test->numberOfQuestions();
        $numberOfCorrectAnswers = 0;

        foreach ($testAttempt->userAnswers as $userAnswer) {

            $question = $test->questions->firstWhere('id', $userAnswer->question_id);
            $correctAnswerId = $question->correctAnswerId;

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