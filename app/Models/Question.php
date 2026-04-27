<?php

namespace App\Models;

use Database\Factories\QuestionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
    /** @use HasFactory<QuestionFactory> */
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get the test that owns the question.
     */
    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }
}
