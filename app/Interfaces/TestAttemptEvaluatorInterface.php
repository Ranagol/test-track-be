<?php

namespace App\Interfaces;

use App\Models\TestAttempt;

interface TestAttemptEvaluatorInterface
{
    /**
     * Every time a user solves a test, a new TestAttempt is created for him in the db. This TestAttempt
     * must be evaluated, must be checked if the users answers were correct, how many of them were
     * correct... This function does exactly that.
     */
    public function evaluate(TestAttempt $testAttempt): void;
}