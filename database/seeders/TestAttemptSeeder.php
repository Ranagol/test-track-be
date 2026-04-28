<?php

namespace Database\Seeders;

use App\Models\TestAttempt;
use Illuminate\Database\Seeder;

class TestAttemptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TestAttempt::factory(3)->create();
    }
}
