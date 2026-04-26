<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Tests created by this user (only if role = tester)
     */
    public function createdTests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    /**
     * Test attempts made by this user (only if role = test-taker)
     */
    // public function testAttempts()
    // {
    //     return $this->hasMany(TestAttempt::class);
    // }

    /**
     * Access tests taken by the user (through attempts)
     * Not required, but very useful
     */
    // public function takenTests()
    // {
    //     return $this->belongsToMany(Test::class, 'test_attempts')
    //         ->withPivot(['score', 'max_score', 'started_at', 'completed_at'])
    //         ->withTimestamps();
    // }

    /*
    |--------------------------------------------------------------------------
    | HELPERS (OPTIONAL BUT VERY USEFUL)
    |--------------------------------------------------------------------------
    */

    public function isTester(): bool
    {
        return $this->hasRole('tester');
    }

    public function isTestTaker(): bool
    {
        return $this->hasRole('test-taker');
    }
}
