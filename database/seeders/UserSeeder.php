<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        $admin = User::factory()->create([
            'name' => config('app.ADMIN_EMAIL'),
            'email' => config('app.ADMIN_EMAIL'),
            'password' => config('app.ADMIN_PASSWORD'),
        ]);
        $admin->assignRole('admin');

        // Default tester
        $defaultTester = User::factory()->create([
            'name' => config('app.DEFAULT_TESTER_EMAIL'),
            'email' => config('app.DEFAULT_TESTER_EMAIL'),
            'password' => config('app.DEFAULT_TESTER_PASSWORD'),
        ]);
        $defaultTester->assignRole('tester');

        // Default test-taker
        $defaultTestTaker = User::factory()->create([
            'name' => config('app.DEFAULT_TEST_TAKER_EMAIL'),
            'email' => config('app.DEFAULT_TEST_TAKER_EMAIL'),
            'password' => config('app.DEFAULT_TEST_TAKER_PASSWORD'),
        ]);
        $defaultTestTaker->assignRole('test-taker');

        // Other testers
        User::factory(2)->create()->each(function (User $user) {
            $user->assignRole('tester');
        });

        // Other test-taker users
        User::factory(2)->create()->each(function (User $user) {
            $user->assignRole('test-taker');
        });
    }
}
