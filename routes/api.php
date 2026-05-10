<?php

use App\Http\Controllers\Api\AnswerOptionController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\TestAttemptController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\UserAnswerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
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

/**
 * EncryptCookies intercepts and decrypts the cookie
 * StartSession loads the session data from the database using the decrypted cookie ID
 * auth:sanctum now has session data to verify against
 */
Route::middleware(['auth:sanctum'])->group(function () {

    // Route::get('/xxx', function (Request $request) {
    //     $t = 8;

    //     return response()->json(
    //         [
    //             'message' => 'API is working',
    //             'user' => $request->user(),
    //         ]
    //     );
    // });

    Route::apiResource('tests', TestController::class);
    Route::apiResource('questions', QuestionController::class);
    Route::apiResource('answer-options', AnswerOptionController::class);
    Route::apiResource('test-attempts', TestAttemptController::class);
    Route::apiResource('user-answers', UserAnswerController::class);
});