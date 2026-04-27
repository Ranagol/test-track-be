<?php

use App\Http\Controllers\Api\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('tests', TestController::class);

Route::get('/xxx', function (Request $request) {
    $t = 8;

    return response()->json(
        [
            'message' => 'API is working',
            'user' => $request->user(),
        ]
    );
});