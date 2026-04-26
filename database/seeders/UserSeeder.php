<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(1)->create()->each(function (User $user) {
            $user->assignRole('admin');
        });

        User::factory(5)->create()->each(function (User $user) {
            $user->assignRole('tester');
            Test::factory(3)->create(['user_id' => $user->id]);
        });

        User::factory(5)->create()->each(function (User $user) {
            $user->assignRole('test-taker');
        });
    }
}