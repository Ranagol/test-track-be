<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Returns the desired test taker, no matter if it has or does not have Test Attempts.
     */
    public function getTestTaker(Request $request): UserResource
    {
        $testTakerId = $request->testTakerId;
        $testTaker = User::findOrFail($testTakerId);

        return new UserResource($testTaker);
    }

    /**
     * Returns the test taker for analytics purposes, only if they have test attempts for the
     * authenticated tester. Otherwise, it will return a 404 (Not Found) error.
     */
    public function getAnalyticsTestTaker(Request $request): UserResource
    {
        $testTakerId = $request->testTakerId;

        TestAttempt::query()
            ->where('user_id', $testTakerId)
            ->forTester(Auth::id())
            ->firstOrFail();

        $testTaker = User::findOrFail($testTakerId);

        return new UserResource($testTaker);
    }
}