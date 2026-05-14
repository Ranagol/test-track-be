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

            if ($correctAnswerId === $userAnswerId) {
                $numberOfCorrectAnswers++;
                $userAnswer->update(['is_correct' => true]);
            } else {
                $userAnswer->update(['is_correct' => false]);
            }
        }

        $successPercentage = $numberOfCorrectAnswers / $numberOfQuestions * 100;

        $testAttempt->update([
            'score_percentage' => $successPercentage,
        ]);
    }
}