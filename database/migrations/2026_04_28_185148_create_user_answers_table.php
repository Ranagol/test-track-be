<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_attempt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')
                ->constrained()
                ->cascadeOnDelete()
                ->comment('This is the question that the answer belongs to.');
            $table->foreignId('answer_option_id')
                ->constrained()
                ->cascadeOnDelete()
                ->comment('This is the answer selected by the test taker.');
            $table->boolean('is_correct')
                ->nullable()
                ->comment('Shows if the users answer is correct. Initially it is null, only after evaluation will this be set to true or false.');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->index(['test_attempt_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_answers');
    }
};
