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
         * Create generic dummy tests for all the testers, who are not tester@gmail.com
         */
        $testers = User::role('tester')->whereNot('email', 'tester@gmail.com')->get();

        foreach ($testers as $tester) {
            Test::factory(3)->for($tester)->create();
        }
    }
}
