<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * Create generic dummy tests for all the testers, who are not default tester
         */
        $defaultTesterEmail = config('DEFAULT_TESTER_EMAIL');
        $testers = User::role('tester')->where('email', '!=', $defaultTesterEmail)->get();

        foreach ($testers as $tester) {
            Test::factory(3)->for($tester)->create();
        }
    }
}