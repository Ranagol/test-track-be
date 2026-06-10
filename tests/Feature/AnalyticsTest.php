<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RealTestSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsTest extends TestCase
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

    public function test_tester_can_access_analytics(): void
    {
        $tester = User::where('email', config('app.DEFAULT_TESTER_EMAIL'))->first();

        // When we do analytics, we actually see then test attempts. Test attempts have the results.
        $response = $this->actingAs($tester)->getJson('/api/analytics');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'test_id',
                    'score_percentage',
                    'comment',
                    'started_at',
                    'completed_at',
                    'created_at',
                    'updated_at',
                    'title',
                    'test' => [
                        'id',
                        'user_id',
                        'title',
                        'description',
                    ],
                ],
            ],
        ]);
    }
}
