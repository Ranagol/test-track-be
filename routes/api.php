<?php

use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\TestController;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * EncryptCookies intercepts and decrypts the cookie
 * StartSession loads the session data from the database using the decrypted cookie ID
 * auth:sanctum now has session data to verify against
 */
Route::middleware([EncryptCookies::class, StartSession::class, 'auth:sanctum'])->group(function () {

    Route::get('/xxx', function (Request $request) {
        $t = 8;

        return response()->json(
            [
                'message' => 'API is working',
                'user' => $request->user(),
            ]
        );
    });

    Route::apiResource('tests', TestController::class);
    Route::apiResource('questions', QuestionController::class);
});