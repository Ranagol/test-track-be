<?php

namespace Tests\Feature;

use App\Models\AnswerOption;
use App\Models\Question;
use App\Models\Test as TestModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_rejects_missing_and_malformed_nested_fields(): void
    {
        $user = $this->createUser();

        $response = $this->actingAs($user)->postJson('/api/tests', [
            'title' => '',
            'description' => '',
            'questions' => [
                [
                    'text' => '',
                    'answer_options' => [
                        ['text' => '', 'is_correct' => false],
                    ],
                ],
            ],
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors([
            'title',
            'description',
            'questions.0.text',
            'questions.0.answer_options',
            'questions.0.answer_options.0.text',
        ]);
    }

    public function test_create_requires_exactly_one_correct_answer(): void
    {
        $user = $this->createUser();
        $payload = $this->validCreatePayload();
        $payload['questions'][0]['answer_options'][0]['is_correct'] = false;

        $response = $this->actingAs($user)->postJson('/api/tests', $payload);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('questions.0.answer_options');
    }

    public function test_create_rejects_a_title_longer_than_255_characters(): void
    {
        $user = $this->createUser();
        $payload = $this->validCreatePayload();
        $payload['title'] = str_repeat('a', 256);

        $response = $this->actingAs($user)->postJson('/api/tests', $payload);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('title');
    }

    public function test_update_requires_a_valid_user_id_and_nested_ids(): void
    {
        $owner = $this->createUser();
        $test = TestModel::factory()->for($owner)->create();

        $response = $this->actingAs($owner)->putJson('/api/tests/' . $test->id, [
            'title' => 'Updated title',
            'description' => 'Updated description',
            'user_id' => 999999,
            'questions' => [
                [
                    'id' => 999999,
                    'text' => 'Updated question',
                    'answer_options' => [
                        [
                            'id' => 999999,
                            'text' => 'Updated answer',
                            'is_correct' => true,
                        ],
                        [
                            'id' => 999998,
                            'text' => 'Another answer',
                            'is_correct' => false,
                        ],
                    ],
                ],
            ],
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors([
            'user_id',
            'questions.0.id',
            'questions.0.answer_options.0.id',
            'questions.0.answer_options.1.id',
        ]);
    }

    public function test_update_requires_exactly_one_correct_answer(): void
    {
        $owner = $this->createUser();
        $test = TestModel::factory()->for($owner)->create();
        $question = Question::factory()->for($test)->create();
        $firstOption = AnswerOption::factory()->for($question)->create(['is_correct' => true]);
        $secondOption = AnswerOption::factory()->for($question)->create(['is_correct' => false]);

        $payload = [
            'title' => 'Updated title',
            'description' => 'Updated description',
            'user_id' => $owner->id,
            'questions' => [
                [
                    'id' => $question->id,
                    'text' => 'Updated question',
                    'answer_options' => [
                        [
                            'id' => $firstOption->id,
                            'text' => 'Updated first answer',
                            'is_correct' => false,
                        ],
                        [
                            'id' => $secondOption->id,
                            'text' => 'Updated second answer',
                            'is_correct' => false,
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($owner)->putJson('/api/tests/' . $test->id, $payload);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('questions.0.answer_options');
    }

    /**
     * @return array{title: string, description: string, questions: array<int, array{text: string, answer_options: array<int, array{text: string, is_correct: bool}>}>}
     */
    private function validCreatePayload(): array
    {
        return [
            'title' => 'A valid test',
            'description' => 'A valid description.',
            'questions' => [
                [
                    'text' => 'What is 2 + 2?',
                    'answer_options' => [
                        ['text' => '4', 'is_correct' => true],
                        ['text' => '5', 'is_correct' => false],
                    ],
                ],
            ],
        ];
    }

    private function createUser(): User
    {
        /** @var User $user */
        $user = User::factory()->create();

        return $user;
    }
}