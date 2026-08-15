<?php

declare(strict_types=1);

namespace App\Services;

use App\Interfaces\TestControllerServiceInterface;
use App\Models\Question;
use App\Models\Test;
use Illuminate\Support\Facades\Auth;

class TestControllerService implements TestControllerServiceInterface
{
    public function createTest(array $validatedData): Test
    {
        // Create unique test code
        $testCode = $this->generateUniqueTestCode();

        // Add the generated test code to the validated data
        $validatedData['test_code'] = $testCode;

        // Add the authenticated user's ID to the validated data
        $validatedData['user_id'] = Auth::id();

        return Test::create($validatedData);
    }

    public function createQuestions(array $questionsData, Test $test): void
    {
        foreach ($questionsData as $questionData) {
            /** @var Question $question */
            $question = $test->questions()->create([
                'text' => $questionData['text'],
            ]);

            $this->createAnswerOptions($question, $questionData['answer_options']);
        }
    }

    public function createAnswerOptions(Question $question, array $answerOptionsData): void
    {
        foreach ($answerOptionsData as $optionData) {
            $question->answerOptions()->create([
                'text' => $optionData['text'],
                'is_correct' => $optionData['is_correct'],
            ]);
        }
    }

    public function generateUniqueTestCode(): string
    {
        // Get all existing test codes
        $existingCodes = Test::pluck('test_code');

        // This is the new test code
        $code = 'TEST-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(1)));

        // Check if the new test code accidentally already exists, until we have a unique one
        while ($existingCodes->contains($code)) {

            // If the new code already exists, generate a new one
            $code = 'TEST-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(1)));
        }

        return $code;
    }

    public function updateTest(array $validatedData, Test $test): void
    {
        // Update the test
        $test->update([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
        ]);

        // Update questions and their answer options
        $this->updateQuestions($validatedData['questions'], $test);

    }

    public function updateQuestions(array $questionsData, Test $test): void
    {
        foreach ($questionsData as $questionData) {
            $question = Question::find($questionData['id']);

            if ($question) {

                // Update existing question
                $question->update([
                    'text' => $questionData['text'],
                ]);

                // Update answer options for this question
                $this->updateAnswerOptions($question, $questionData['answer_options']);
            }
        }
    }

    public function updateAnswerOptions(Question $question, array $answerOptionsData): void
    {
        foreach ($answerOptionsData as $answerOptionData) {
            $option = $question->answerOptions()->find($answerOptionData['id']);

            if ($option) {

                // Update existing answer option
                $option->update([
                    'text' => $answerOptionData['text'],
                    'is_correct' => $answerOptionData['is_correct'],
                ]);
            }
        }
    }
}
