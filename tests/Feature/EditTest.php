<?php

namespace Tests\Feature;

use App\Models\Test;
use App\Models\User;
use Database\Seeders\RealTestSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            RealTestSeeder::class,
        ]);
    }

    public function tester_can_edit_test(): void
    {
        $tester = User::where('email', config('app.DEFAULT_TESTER_EMAIL'))->first();

        $testToUpdate = Test::where('title', 'Math test')->with('questions.answerOptions')->first();

        $testToUpdateArray = $testToUpdate->toArray();

        $newTestData = [
            'id' => $testToUpdate->id,
            'user_id' => $tester->id,
            'title' => 'New  math test',
            'description' => 'This is a new math test.',
            'questions' => [
                [
                    'id' => $testToUpdateArray['questions'][0]['id'],
                    'test_id' => $testToUpdate->id,
                    'text' => 'What is 6 + 6?',
                    'answer_options' => [
                        [
                            'id' => $testToUpdateArray['questions'][0]['answer_options'][0]['id'],
                            'question_id' => $testToUpdateArray['questions'][0]['id'],
                            'text' => '12',
                            'is_correct' => true,
                        ],
                        [
                            'id' => $testToUpdateArray['questions'][0]['answer_options'][1]['id'],
                            'question_id' => $testToUpdateArray['questions'][0]['id'],
                            'text' => '3',
                            'is_correct' => false,
                        ],
                        [
                            'id' => $testToUpdateArray['questions'][0]['answer_options'][2]['id'],
                            'question_id' => $testToUpdateArray['questions'][0]['id'],
                            'text' => '5',
                            'is_correct' => false,
                        ],
                    ],
                ],
                [
                    'id' => $testToUpdateArray['questions'][1]['id'],
                    'test_id' => $testToUpdate->id,
                    'text' => 'What is the capital of France?',
                    'answer_options' => [
                        [
                            'id' => $testToUpdateArray['questions'][1]['answer_options'][0]['id'],
                            'question_id' => $testToUpdateArray['questions'][1]['id'],
                            'text' => 'Paris',
                            'is_correct' => true,
                        ],
                        [
                            'id' => $testToUpdateArray['questions'][1]['answer_options'][1]['id'],
                            'question_id' => $testToUpdateArray['questions'][1]['id'],
                            'text' => 'London',
                            'is_correct' => false,
                        ],
                        [
                            'id' => $testToUpdateArray['questions'][1]['answer_options'][2]['id'],
                            'question_id' => $testToUpdateArray['questions'][1]['id'],
                            'text' => 'Berlin',
                            'is_correct' => false,
                        ],
                    ],
                ],
                [
                    'id' => $testToUpdateArray['questions'][2]['id'],
                    'test_id' => $testToUpdate->id,
                    'text' => 'What is the capital of Germany?',
                    'answer_options' => [
                        [
                            'id' => $testToUpdateArray['questions'][2]['answer_options'][0]['id'],
                            'question_id' => $testToUpdateArray['questions'][2]['id'],
                            'text' => 'Berlin',
                            'is_correct' => true,
                        ],
                        [
                            'id' => $testToUpdateArray['questions'][2]['answer_options'][1]['id'],
                            'question_id' => $testToUpdateArray['questions'][2]['id'],
                            'text' => 'Munich',
                            'is_correct' => false,
                        ],
                        [
                            'id' => $testToUpdateArray['questions'][2]['answer_options'][2]['id'],
                            'question_id' => $testToUpdateArray['questions'][2]['id'],
                            'text' => 'Frankfurt',
                            'is_correct' => false,
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($tester)->putJson('/api/tests/' . $testToUpdate->id, $newTestData);
        $response->assertStatus(200);

        $updatedTest = Test::where('id', $testToUpdate->id)
            ->with('questions.answerOptions')
            ->first();

        $updatedTestArray = $updatedTest->toArray();

        // Assert test was modified
        $this->assertFalse($testToUpdateArray === $updatedTestArray);

        // Assert basic test fields, title and description, were updated
        $this->assertEquals($newTestData['title'], $updatedTestArray['title']);
        $this->assertEquals($newTestData['description'], $updatedTestArray['description']);

        // Assert questions and answers were updated as well, by comparing the newTestData with the updatedTestArray
        foreach ($newTestData['questions'] as $index => $newQuestion) {

            // Assert question text was updated
            $this->assertEquals($newQuestion['text'], $updatedTestArray['questions'][$index]['text']);

            // Assert answer options were updated
            foreach ($newQuestion['answer_options'] as $answerIndex => $newAnswer) {
                $this->assertEquals(
                    $newAnswer['text'],
                    $updatedTestArray['questions'][$index]['answer_options'][$answerIndex]['text']
                );
                $this->assertEquals(
                    $newAnswer['is_correct'],
                    $updatedTestArray['questions'][$index]['answer_options'][$answerIndex]['is_correct']
                );
            }
        }
    }
}
