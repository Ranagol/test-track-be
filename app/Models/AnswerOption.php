<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $question_id
 * @property string $text
 * @property bool $is_correct
 * @property int|null $answer_order
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class AnswerOption extends Model
{
    /** @phpstan-ignore-next-line */
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get the question that owns the answer option.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
