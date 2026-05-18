<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Test;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * This controller is a bit specific. Does not have belonging model or db table. It returns
 * sometimes tests, sometimes TestAttempt, sometimes something third. Whatever is needed for analytics
 * purpose on the frontend.
 */
class AnalyticsController extends Controller
{
    /**
     * We actually return here tests with their test attempts and the user that did the test attempt.
     */
    public function index(Request $request): JsonResponse
    {
        $testerId = Auth::user()->id;

        $query = Test::where('user_id', $testerId)
            // For the tests, I need only these columns
            ->select('id', 'user_id', 'title', 'description')
            ->with([
                // For attempts, I need only these columns
                'attempts:id,user_id,test_id,score_percentage,comment,created_at',

                // For the user belonging to the attempt, I need only these columns
                'attempts.user:id,name',
            ]);

        // Search by title or test taker name
        if ($request->has('search') && $request->search !== '') {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhereHas('attempts.user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
        }

        // Sort
        $sortBy = $request->sort_by ?? 'title';
        $sortOrder = $request->sort_order ?? 'desc';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->per_page ?? 2;
        $tests = $query->paginate($perPage);

        return response()->json($tests);
    }
}
