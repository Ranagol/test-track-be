<?php

use App\Http\Controllers\Api\AnswerOptionController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\TestAttemptController;
use App\Http\Controllers\Api\TestController;
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
    ->middleware('guest')
    ->name('login');

// Register
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {

    // Return the currently authenticated user.
    return $request->user();
});

// This route is for testing purposes only, it should be removed in production
Route::get('/xxx', function (Request $request) {
    $t = 8;

    return response()->json(
        [
            'message' => 'API is working',
            'user' => $request->user(),
        ]
    );
});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::apiResource('tests', TestController::class);
    Route::apiResource('questions', QuestionController::class);
    Route::apiResource('answer-options', AnswerOptionController::class);
    Route::apiResource('test-attempts', TestAttemptController::class);
    Route::apiResource('user-answers', UserAnswerController::class);
});