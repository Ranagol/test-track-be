<?php

namespace App\Models;

use Database\Factories\TestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string $test_code
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Test extends Model
{
    /** @use HasFactory<TestFactory> */
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get the user that owns the test.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
