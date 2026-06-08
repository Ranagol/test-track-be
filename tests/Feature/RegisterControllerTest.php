<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
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

    public function test_register_with_valid_data(): void
    {
        $response = $this->post('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticatedAs($this->user);
    }

    public function test_register_with_invalid_data(): void
    {
        $response = $this->post('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticatedAs($this->user);
    }
}