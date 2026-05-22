<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            // These are just simulated tests, with dummy text
            TestSeeder::class,
            QuestionSeeder::class,
            AnswerOptionSeeder::class,
            TestAttemptSeeder::class,
            UserAnswerSeeder::class,
            // Below we seed meaningful, human-readable tests, answers, questions, attempts.
            RealTestSeeder::class,
            RealTestAttemptSeeder::class,
        ]);
    }
}
