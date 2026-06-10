<?php

namespace Tests\Feature;

use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use Database\Seeders\RealTestSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TakeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([

            // TODO ANDOR we need to get rid of the Spatie Permissions
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            RealTestSeeder::class,
        ]);
    }

    /**
     * We 'solve' here the Math test, which was seeded in setUp().
     */
    public function test_user_can_take_test_and_it_will_be_scored_correctly(): void
    {
        $testTaker = User::where('email', config('app.DEFAULT_TEST_TAKER_EMAIL'))->first();

        $test = Test::where('title', 'Math test')->with('questions.answerOptions')->first();

        $testArray = $test->toArray();

        // We create here a TestAttempt with 3 answers, for submitting to the API
        $testAttempt = [
            'test_attempt' => [
                'test_id' => $test->id,
                'user_id' => $testTaker->id,
            ],
            'user_answers' => [
                [
                    // First question
                    'question_id' => $testArray['questions'][0]['id'],

                    // Only first answer option is always the correct one, as per RealTestSeeder.
                    'answer_option_id' => $testArray['questions'][0]['answer_options'][0]['id'],
                ],
                [
                    // Second question
                    'question_id' => $testArray['questions'][1]['id'],

                    // Wrong answer option (because only first answer option is correct)
                    'answer_option_id' => $testArray['questions'][1]['answer_options'][1]['id'],
                ],
                [
                    // Third question
                    'question_id' => $testArray['questions'][2]['id'],

                    // Wrong answer option (because only first answer option is correct)
                    'answer_option_id' => $testArray['questions'][2]['answer_options'][1]['id'],
                ],
            ],
        ];

        $response = $this->actingAs($testTaker)->postJson('/api/test-attempts', $testAttempt);

        $response->assertStatus(201);

        $response->assertJsonStructure([
            'data' => [
                'id',
                'test_id',
                'user_id',
                'score_percentage',
                'created_at',
                'updated_at',
                'userAnswers' => [
                    '*' => [
                        'id',
                        'test_attempt_id',
                        'question_id',
                        'answer_option_id',
                    ],
                ],
            ],
        ]);

        // Access the newly created test attempt from the database
        $freshTestAttempt = TestAttempt::where('user_id', $testTaker->id)
            ->where('test_id', $test->id)
            ->latest()
            ->first();

        /**
         * This test taking in this method is done so, that the final expected score is 33.33
         * Because 1 question was correctly answered, two questions were incorrectly answered.
         */
        $expectedScore = 33.33;
        $this->assertEquals($expectedScore, $freshTestAttempt->score_percentage); // 1 correct out of 3

        /**
         * In this test, the user answered 3 questions, so we expect to have 3 user answers.
         */
        $expectedNumberOfUserAnswers = 3;
        $this->assertCount($expectedNumberOfUserAnswers, $freshTestAttempt->userAnswers);
    }
}
