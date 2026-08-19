<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestResource;
use App\Http\Resources\TestTakerResource;
use App\Models\Test;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TestTakerController extends Controller
{
    /**
     * Used here:
     * FE url: http://localhost:5174/test-takers
     * BE url: /api/test-takers
     * Triggers: TestTakerController@index
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $tester = Auth::user();

        /**
         * Get all test takers that belong to this tester (i.e. have test attempts for tests created by this tester)
         */
        $testTakersQuery = User::whereHas('testAttempts', function ($query) use ($tester) {
            $query->forTester($tester->id);
        });

        // Search by test taker name
        if ($request->has('search') && $request->search !== '') {
            $testTakersQuery->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort
        $testTakersQuery->orderBy('name', 'asc');

        // Paginate
        $perPage = $request->per_page ?? 10;
        $testTakers = $testTakersQuery->paginate($perPage);

        // dd($testTakersQuery->toSql(), $testTakersQuery->getBindings());

        return TestTakerResource::collection($testTakers);
    }

    /**
     * This function is called at FE url /test-takers/:testTakerId (Analytics details)
     * It sends all belonging tests, questions, answers, attempts for the give test taker, so its
     * test performances could be analyzed.
     *
     * FE url: http://localhost:5174/test-takers/5
     * BE url: /api/test-takers/5
     */
    public function show(Request $request, int $testTakerId): AnonymousResourceCollection
    {
        $user = Auth::user();

        $tests = Test::whereHas('attempts', function ($q) use ($testTakerId) {
            $q->where('user_id', $testTakerId);
        })
            ->with(
                [
                    'questions.correctAnswerText',
                    'attempts' => function ($q) use ($testTakerId) {
                        $q->where('user_id', $testTakerId)->with('userAnswers.answerOption');
                    },
                ]
            )
            // Only return tests that belong to the authenticated tester, and not all tests
            ->where('user_id', $user->id)
            ->get();

        return TestResource::collection($tests);
    }
}