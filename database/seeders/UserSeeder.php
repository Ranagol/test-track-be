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
        // Admin user
        User::factory(1)->create([
            'name' => config('app.ADMIN_EMAIL'),
            'email' => config('app.ADMIN_PASSWORD'),
        ])->each(function (User $user) {
            $user->assignRole('admin');
        });

        // Default tester user
        User::factory(1)->create([
            'name' => config('app.DEFAULT_TESTER_EMAIL'),
            'email' => config('app.DEFAULT_TESTER_PASSWORD'),
        ])->each(function (User $user) {
            $user->assignRole('tester');
            Test::factory(3)->create(['user_id' => $user->id]);
        });

        // Default test-taker user
        User::factory(1)->create([
            'name' => config('app.DEFAULT_TEST_TAKER_EMAIL'),
            'email' => config('app.DEFAULT_TEST_TAKER_PASSWORD'),
        ])->each(function (User $user) {
            $user->assignRole('test-taker');
        });

        // Other tester users
        User::factory(4)->create()->each(function (User $user) {
            $user->assignRole('tester');
            Test::factory(3)->create(['user_id' => $user->id]);
        });

        // Other test-taker users
        User::factory(4)->create()->each(function (User $user) {
            $user->assignRole('test-taker');
        });
    }
}
