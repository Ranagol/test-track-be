<?php

namespace Database\Seeders;

use App\Models\AnswerOption;
use Illuminate\Database\Seeder;

class AnswerOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AnswerOption::factory(3)->create();
    }
}
