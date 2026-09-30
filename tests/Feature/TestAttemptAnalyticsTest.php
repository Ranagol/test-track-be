<?php

namespace Tests\Feature;

use App\Models\Test as TestModel;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TestAttemptAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_tester_only_sees_attempts_for_their_tests(): void
    {
        $tester = $this->createUser();
        $otherTester = $this->createUser();
        $testTaker = $this->createUser();

        $ownedTest = TestModel::factory()->for($tester)->create();
        $otherTest = TestModel::factory()->for($otherTester)->create();
        $ownedAttempt = TestAttempt::factory()
            ->for($testTaker, 'user')
            ->for($ownedTest, 'test')
            ->create(['score_percentage' => 80]);
        TestAttempt::factory()
            ->for($testTaker, 'user')
            ->for($otherTest, 'test')
            ->create(['score_percentage' => 90]);

        $response = $this->actingAs($tester)->getJson('/api/test-attempts');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'test_id',
                    'score_percentage',
                    'test',
                    'user',
                ],
            ],
            'meta',
        ]);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $ownedAttempt->id);
    }

    public function test_attempts_can_be_searched_by_test_title_or_test_taker_name(): void
    {
        $tester = $this->createUser();
        $alice = $this->createUser(['name' => 'Alice Searchable']);
        $bob = $this->createUser(['name' => 'Bob Searchable']);
        $algebraTest = TestModel::factory()->for($tester)->create(['title' => 'Algebra fundamentals']);
        $historyTest = TestModel::factory()->for($tester)->create(['title' => 'History fundamentals']);
        $algebraAttempt = TestAttempt::factory()
            ->for($alice, 'user')
            ->for($algebraTest, 'test')
            ->create();
        $historyAttempt = TestAttempt::factory()
            ->for($bob, 'user')
            ->for($historyTest, 'test')
            ->create();

        $response = $this->actingAs($tester)->getJson('/api/test-attempts?searchTerm=Algebra');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $algebraAttempt->id);

        $response = $this->actingAs($tester)->getJson('/api/test-attempts?searchTerm=Bob%20Searchable');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $historyAttempt->id);
    }

    public function test_attempts_support_allowed_sorting_and_pagination(): void
    {
        $tester = $this->createUser();
        $testTaker = $this->createUser();
        $test = TestModel::factory()->for($tester)->create();
        $lowestScore = $this->createAttempt($test, $testTaker, 20, now()->subDays(3));
        $highestScore = $this->createAttempt($test, $testTaker, 95, now()->subDays(2));
        $middleScore = $this->createAttempt($test, $testTaker, 60, now()->subDay());

        $response = $this->actingAs($tester)
            ->getJson('/api/test-attempts?per_page=2&sort_by=score_percentage&sort_order=desc');

        $response->assertOk();
        $response->assertJsonPath('meta.total', 3);
        $response->assertJsonCount(2, 'data');
        $response->assertJsonPath('data.0.id', $highestScore->id);
        $response->assertJsonPath('data.1.id', $middleScore->id);
        $this->assertNotSame($lowestScore->id, $response->json('data.0.id'));
    }

    public function test_unsupported_sort_column_falls_back_to_created_at(): void
    {
        $tester = $this->createUser();
        $testTaker = $this->createUser();
        $test = TestModel::factory()->for($tester)->create();
        $oldestAttempt = $this->createAttempt($test, $testTaker, 20, now()->subDays(3));
        $newestAttempt = $this->createAttempt($test, $testTaker, 95, now()->subDay());

        $response = $this->actingAs($tester)
            ->getJson('/api/test-attempts?sort_by=unsupported_column&sort_order=asc');

        $response->assertOk();
        $response->assertJsonPath('data.0.id', $oldestAttempt->id);
        $response->assertJsonPath('data.1.id', $newestAttempt->id);
    }

    public function test_guest_cannot_access_attempt_analytics(): void
    {
        $this->getJson('/api/test-attempts')->assertUnauthorized();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createUser(array $attributes = []): User
    {
        /** @var User $user */
        $user = User::factory()->create($attributes);

        return $user;
    }

    private function createAttempt(
        TestModel $test,
        User $testTaker,
        float $score,
        Carbon $createdAt
    ): TestAttempt {
        /** @var TestAttempt $attempt */
        $attempt = TestAttempt::factory()
            ->for($test, 'test')
            ->for($testTaker, 'user')
            ->create([
                'score_percentage' => $score,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

        return $attempt;
    }
}
