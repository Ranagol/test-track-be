<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getTestTaker(Request $request): UserResource
    {
        $testTakerId = $request->testTakerId;
        $testTaker = User::findOrFail($testTakerId);

        return new UserResource($testTaker);
    }
}
