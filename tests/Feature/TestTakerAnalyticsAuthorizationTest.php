<?php

namespace Tests\Feature;

use App\Models\Test as TestModel;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestTakerAnalyticsAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_tester_can_view_an_associated_test_taker(): void
    {
        $tester = $this->createUser();
        $testTaker = $this->createUser();
        $test = TestModel::factory()->for($tester)->create();
        TestAttempt::factory()->for($test, 'test')->for($testTaker, 'user')->create();

        $response = $this->actingAs($tester)->getJson('/api/test-takers/' . $testTaker->id);

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'tests',
                'test_attempts',
                'last_test_attempt',
            ],
        ]);
        $response->assertJsonPath('data.id', $testTaker->id);
    }

    public function test_tester_cannot_view_an_unassociated_test_taker(): void
    {
        $tester = $this->createUser();
        $otherTester = $this->createUser();
        $testTaker = $this->createUser();
        $otherTest = TestModel::factory()->for($otherTester)->create();
        TestAttempt::factory()->for($otherTest, 'test')->for($testTaker, 'user')->create();

        $response = $this->actingAs($tester)->getJson('/api/test-takers/' . $testTaker->id);

        $response->assertForbidden();
    }

    public function test_performance_only_returns_tests_owned_by_the_authenticated_tester(): void
    {
        $tester = $this->createUser();
        $otherTester = $this->createUser();
        $testTaker = $this->createUser();
        $ownedTest = TestModel::factory()->for($tester)->create(['title' => 'Owned analytics test']);
        $otherTest = TestModel::factory()->for($otherTester)->create(['title' => 'Private analytics test']);
        TestAttempt::factory()->for($ownedTest, 'test')->for($testTaker, 'user')->create();
        TestAttempt::factory()->for($otherTest, 'test')->for($testTaker, 'user')->create();

        $response = $this->actingAs($tester)
            ->getJson('/api/test-takers/' . $testTaker->id . '/performance');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $ownedTest->id);
        $response->assertJsonPath('data.0.title', 'Owned analytics test');
        $response->assertJsonMissing(['title' => 'Private analytics test']);
    }

    public function test_unknown_test_taker_returns_not_found_for_summary_and_empty_performance(): void
    {
        $tester = $this->createUser();

        $this->actingAs($tester)
            ->getJson('/api/test-takers/999999')
            ->assertNotFound();

        $response = $this->actingAs($tester)
            ->getJson('/api/test-takers/999999/performance');

        $response->assertOk();
        $response->assertJsonCount(0, 'data');
    }

    public function test_guest_cannot_access_test_taker_analytics(): void
    {
        $this->getJson('/api/test-takers/1')->assertUnauthorized();
        $this->getJson('/api/test-takers/1/performance')->assertUnauthorized();
    }

    private function createUser(): User
    {
        /** @var User $user */
        $user = User::factory()->create();

        return $user;
    }
}
