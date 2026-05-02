<?php

namespace Tests\Feature;

use App\Models\AnswerOption;
use App\Models\Question;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use App\Models\UserAnswer;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RelationshipTest extends TestCase
{
    use RefreshDatabase;

    private User $tester;

    private User $testTaker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);

        $this->tester = User::factory()->create();
        $this->tester->assignRole('tester');

        $this->testTaker = User::factory()->create();
        $this->testTaker->assignRole('test-taker');
    }

    private function compareCollections(Collection $collection1, Collection $collection2): void
    {
        $this->assertEquals($collection1->count(), $collection2->count());

        $this->assertEqualsCanonicalizing(
            $collection1->pluck('id')->toArray(),
            $collection2->pluck('id')->toArray()
        );
    }

    // 1
    public function test_tester_test_relationship(): void
    {
        $tests = Test::factory(2)->for($this->tester)->create();
        $testsFromRelationship = $this->tester->createdTests()->get();
        $this->compareCollections($tests, $testsFromRelationship);

        $test = $tests->first();
        $userFromRelationship = $test->user()->first();
        $this->assertEquals($this->tester->id, $userFromRelationship->id);
    }

    // 2
    public function test_user_test_attempt_relationship(): void
    {
        $testAttempts = TestAttempt::factory(2)->for($this->testTaker)->create();
        $testAttemptsFromRelationship = $this->testTaker->testAttempts()->get();
        $this->compareCollections($testAttempts, $testAttemptsFromRelationship);

        $testAttempt = $testAttempts->first();
        $userFromRelationship = $testAttempt->user()->first();
        $this->assertEquals($this->testTaker->id, $userFromRelationship->id);
    }

    // 3
    public function test_test_question_relationship(): void
    {
        $test = Test::factory()->for($this->tester)->create();
        $questions = Question::factory(2)->for($test)->create();
        $questionsFromRelationship = $test->questions()->get();
        $this->compareCollections($questions, $questionsFromRelationship);

        $question = $questions->first();
        $testFromRelationship = $question->test()->first();
        $this->assertEquals($test->id, $testFromRelationship->id);
    }

    // 4
    public function test_question_answer_options_relationship(): void
    {
        $question = Question::factory()->create();
        $answerOptions = AnswerOption::factory(2)->for($question)->create();
        $answerOptionsFromRelationship = $question->answerOptions()->get();
        $this->compareCollections($answerOptions, $answerOptionsFromRelationship);

        $answerOption = $answerOptions->first();
        $questionFromRelationship = $answerOption->question()->first();
        $this->assertEquals($question->id, $questionFromRelationship->id);
    }

    // 5
    public function test_test_test_attempt_relationship(): void
    {
        $test = Test::factory()->for($this->tester)->create();
        $testAttempts = TestAttempt::factory(2)->for($test)->for($this->testTaker)->create();
        $testAttemptsFromRelationship = $test->attempts()->get();
        $this->compareCollections($testAttempts, $testAttemptsFromRelationship);

        $testAttempt = $testAttempts->first();
        $testFromRelationship = $testAttempt->test()->first();
        $this->assertEquals($test->id, $testFromRelationship->id);
    }

    // // 6 UserAnswer - TestAttempt
    // public function test_user_answer_test_attempt_relationship(): void
    // {
    //     // Compare user answers
    //     $testAttempt = TestAttempt::factory()->for($this->testTaker)->create();
    //     $userAnswers = UserAnswer::factory(2)->for($testAttempt)->create();
    //     $userAnswersFromRelationship = $testAttempt->userAnswers()->get();
    //     $this->compareCollections($userAnswers, $userAnswersFromRelationship);

    //     // Compare test attempts
    //     $userAnswer = $userAnswers->first();
    //     $testAttemptFromRelationship = $userAnswer->testAttempt()->get();
    //     $this->assertEquals($testAttempt->id, $testAttemptFromRelationship->id);
    // }

    // // 7 UserAnswer - Question
    // public function test_user_answer_question_relationship(): void
    // {
    //     // Compare user answers
    //     $question = Question::factory()->create();
    //     $userAnswers = UserAnswer::factory(2)->for($question)->create();
    //     $userAnswersFromRelationship = $question->userAnswers()->get();
    //     $this->compareCollections($userAnswers, $userAnswersFromRelationship);

    //     // Compare questions
    //     $userAnswer = $userAnswers->first();
    //     $questionFromRelationship = $userAnswer->question()->get();
    //     $this->assertEquals($question->id, $questionFromRelationship->id);
    // }

    // // 8 UserAnswer - AnswerOption
    // public function test_user_answer_answer_option_relationship(): void
    // {
    //     // Compare user answers
    //     $answerOption = AnswerOption::factory()->create();
    //     $userAnswers = UserAnswer::factory(2)->for($answerOption)->create();
    //     $userAnswersFromRelationship = $answerOption->userAnswers()->get();
    //     $this->compareCollections($userAnswers, $userAnswersFromRelationship);

    //     // Compare answer options
    //     $userAnswer = $userAnswers->first();
    //     $answerOptionFromRelationship = $userAnswer->answerOption()->get();
    //     $this->assertEquals($answerOption->id, $answerOptionFromRelationship->id);
    // }
}
