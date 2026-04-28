<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $test_id
 * @property string $text
 * @property string|null $image_path
 * @property bool $allows_multiple_correct
 * @property int|null $question_order
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Question extends Model
{
    /** @phpstan-ignore-next-line */
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get the test that owns the question.
     */
    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    /**
     * Get the user answer for this question.
     */
    public function userAnswer(): HasOne
    {
        return $this->hasOne(UserAnswer::class);
    }
}
