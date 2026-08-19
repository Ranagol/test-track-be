<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestTakerResource;
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
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        // If $sortOrder is either 'asc' or 'desc', keep it. Otherwise, default to 'desc'.
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $testTakersQuery->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->per_page ?? 10;
        $testTakers = $testTakersQuery->paginate($perPage);

        return TestTakerResource::collection($testTakers);
    }
}
