<?php

use App\Http\Controllers\Api\AnswerOptionController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\TestAttemptController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\TestTakerController;
use App\Http\Controllers\Api\UserAnswerController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * Login, register and logout work with Breeze. Breeze is for web requests by default, not api
 * requests. So, we needed to add the API routes for login, register and logout here.
 */
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login');

// Register
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->name('register');

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {

    // Return the currently authenticated user.
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/tests/test-code/{testCode}', [TestController::class, 'getTestByCode']);
    Route::apiResource('tests', TestController::class);

    Route::apiResource('test-attempts', TestAttemptController::class);

    Route::apiResource('questions', QuestionController::class)->except(['update']);
    Route::post('/questions/{question}/correct-answer', [QuestionController::class, 'setCorrectAnswer']);

    Route::apiResource('answer-options', AnswerOptionController::class)->except(['update']);

    Route::apiResource('user-answers', UserAnswerController::class);

    Route::get('/test-takers', [TestTakerController::class, 'index']);

    /**
     * This function is called at FE url /analytics/:testTakerId (Analytics details)
     * It sends all belonging tests, questions, answers, attempts for the give test taker, so its
     * test performances could be analyzed.
     *
     * FE url: http://localhost:5174/analytics/5
     * BE url: /api/analytics?testTakerId=5
     * Triggers: TestController@indexAnalytics
     */
    Route::get('/analytics', [TestController::class, 'indexAnalytics']);

});
