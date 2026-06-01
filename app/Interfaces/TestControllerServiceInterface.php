<?php

namespace App\Interfaces;

use App\Models\Question;
use App\Models\Test;

interface TestControllerServiceInterface
{
    public function createTest(array $validatedData): Test;

    public function createQuestions(array $questionsData, Test $test): void;

    public function createAnswerOptions(Question $question, array $answerOptionsData): void;

    public function generateUniqueTestCode(): string;

    public function updateTest(array $validatedData, Test $test): void;

    public function updateQuestions(array $questionsData, Test $test): void;

    public function updateAnswerOptions(Question $question, array $answerOptionsData): void;
}
