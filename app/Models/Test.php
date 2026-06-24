<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string $test_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Test extends Model
{
    /** @phpstan-ignore-next-line */
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get the user (tester) that owns the test.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the questions for the test.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function numberOfQuestions(): int
    {
        return $this->questions()->count();
    }

    /**
     * Get the test attempts for the test.
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(TestAttempt::class);
    }
}