<?php

namespace Tests\Feature;

use App\Models\AnswerOption;
use App\Models\Question;
use App\Models\Test as TestModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestCrudAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_view_their_test(): void
    {
        $owner = $this->createUser();
        $test = TestModel::factory()->for($owner)->create();

        $response = $this->actingAs($owner)->getJson('/api/tests/' . $test->id);

        $response->assertOk();
        $response->assertJsonPath('data.id', $test->id);
        $response->assertJsonPath('data.title', $test->title);
    }

    public function test_non_owner_cannot_view_the_test(): void
    {
        $owner = $this->createUser();
        $otherUser = $this->createUser();
        $test = TestModel::factory()->for($owner)->create();

        $response = $this->actingAs($otherUser)->getJson('/api/tests/' . $test->id);

        $response->assertForbidden();
    }

    public function test_owner_can_delete_their_test(): void
    {
        $owner = $this->createUser();
        $test = TestModel::factory()->for($owner)->create();

        $response = $this->actingAs($owner)->deleteJson('/api/tests/' . $test->id);

        $response->assertOk();
        $response->assertJson(['message' => 'Delete successful']);
        $this->assertModelMissing($test);
    }

    public function test_non_owner_cannot_update_or_delete_the_test(): void
    {
        $owner = $this->createUser();
        $otherUser = $this->createUser();
        $test = TestModel::factory()->for($owner)->create();
        $question = Question::factory()->for($test)->create();
        $correctOption = AnswerOption::factory()->for($question)->create(['is_correct' => true]);
        $incorrectOption = AnswerOption::factory()->for($question)->create(['is_correct' => false]);

        $response = $this->actingAs($otherUser)->putJson('/api/tests/' . $test->id, [
            'title' => 'Updated title',
            'description' => 'Updated description',
            'user_id' => $owner->id,
            'questions' => [
                [
                    'id' => $question->id,
                    'text' => $question->text,
                    'answer_options' => [
                        [
                            'id' => $correctOption->id,
                            'text' => $correctOption->text,
                            'is_correct' => true,
                        ],
                        [
                            'id' => $incorrectOption->id,
                            'text' => $incorrectOption->text,
                            'is_correct' => false,
                        ],
                    ],
                ],
            ],
        ]);

        $response->assertForbidden();

        $response = $this->actingAs($otherUser)->deleteJson('/api/tests/' . $test->id);

        $response->assertForbidden();
        $this->assertModelExists($test);
    }

    public function test_guest_cannot_access_test_crud_endpoints(): void
    {
        $test = TestModel::factory()->create();

        $this->getJson('/api/tests')->assertUnauthorized();
        $this->getJson('/api/tests/' . $test->id)->assertUnauthorized();
        $this->deleteJson('/api/tests/' . $test->id)->assertUnauthorized();
    }

    public function test_test_index_only_returns_owned_tests_and_supports_search_and_pagination(): void
    {
        $owner = $this->createUser();
        $otherUser = $this->createUser();

        TestModel::factory()->for($owner)->create(['title' => 'Alpha owned test']);
        TestModel::factory()->for($owner)->create(['title' => 'Beta owned test']);
        TestModel::factory()->for($otherUser)->create(['title' => 'Alpha other test']);

        $response = $this->actingAs($owner)->getJson('/api/tests?search=owned&per_page=1&sort_by=title&sort_order=asc');

        $response->assertOk();
        $response->assertJsonPath('meta.total', 2);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Alpha owned test');
    }

    private function createUser(): User
    {
        /** @var User $user */
        $user = User::factory()->create();

        return $user;
    }
}