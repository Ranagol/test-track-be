<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'password' => bcrypt('password123'),
            ]
        );
    }

    public function test_login_with_valid_credentials(): void
    {
        $response = $this->post('/api/login', [
            'email' => $this->user->email,
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($this->user);
        $response->assertStatus(200);
    }

    //     public function test_login_with_invalid_credentials(): void
    //     {
    //         $response = $this->post('/api/login', [
    //             'email' => $this->user->email,
    //             'password' => 'wrongpassword',
    //         ]);

    //         // $this->assertGuest();
    //         $response->assertStatus(302); // here we have a problem //todo andor

    //     }
}
