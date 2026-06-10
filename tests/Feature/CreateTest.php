<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTest extends TestCase
{
    use RefreshDatabase;

    private User $tester;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tester = User::create([
            'name' => 'Tester',
            'email' => config('app.DEFAULT_TESTER_EMAIL'),
            'password' => bcrypt('password'),
        ]);

    }

    public function test_tester_can_create_test(): void
    {
        $tester = $this->tester;

        $newTestData = [
            'title' => 'New test',
            'description' => 'This is a new test.',
            'user_id' => $tester->id,
            'questions' => [
                [
                    'text' => 'What is 2 + 2?',
                    'answer_options' => [
                        ['text' => '4', 'is_correct' => true],
                        ['text' => '3', 'is_correct' => false],
                        ['text' => '5', 'is_correct' => false],
                    ],
                ],
                [
                    'text' => 'What is the capital of France?',
                    'answer_options' => [
                        ['text' => 'Paris', 'is_correct' => true],
                        ['text' => 'London', 'is_correct' => false],
                        ['text' => 'Berlin', 'is_correct' => false],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($tester)->postJson('/api/tests', $newTestData);

        $response->assertStatus(201);

        $response->assertJsonStructure([
            'data' => [
                'id',
                'user_id',
                'title',
                'description',
                'test_code',
                'created_at',
            ],
        ]);
    }
}
