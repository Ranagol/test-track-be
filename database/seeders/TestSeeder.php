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
        $testers = User::role('tester')->get();

        foreach ($testers as $tester) {
            Test::factory(3)->for($tester)->create();
        }
    }
}