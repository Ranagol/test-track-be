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

        /**
         * We do not want for this user to have test attempts, because for him we will make manually
         * meaningful and human-readable tests.
         */
        $exceptionTestTakerEmail = config('app.DEFAULT_TEST_TAKER_EMAIL');
        $testTakers = User::role('test-taker')
            ->where('email', '!=', $exceptionTestTakerEmail)
            ->get();

        $t = 8;

        // Every testTaker tried to make an attempt for every test twice
        foreach ($testTakers as $testTaker) {
            foreach ($tests as $test) {

                // First testAttempt for the given test and testTaker
                TestAttempt::factory()->create([
                    'user_id' => $testTaker->id,
                    'test_id' => $test->id,
                ]);
            }
        }
    }
}
