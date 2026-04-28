<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestAttemptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tests = Test::all();
        $testTakers = User::role('test-taker')->get();

        // Every testTaker tried to make an attempt for every test twice
        foreach ($testTakers as $testTaker) {
            foreach ($tests as $test) {

                // First testAttempt
                TestAttempt::factory()->create([
                    'user_id' => $testTaker->id,
                    'test_id' => $test->id,
                ]);

                TestAttempt::factory()->create([
                    'user_id' => $testTaker->id,
                    'test_id' => $test->id,
                    'score' => 90, // Just a placeholder score
                ]);
            }
        }
    }
}
