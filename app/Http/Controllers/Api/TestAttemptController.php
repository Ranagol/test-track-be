<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestAttemptRequest;
use App\Http\Requests\UpdateTestAttemptRequest;
use App\Http\Resources\TestAttemptResource;
use App\Interfaces\TestAttemptEvaluatorInterface;
use App\Models\TestAttempt;
use App\Models\UserAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TestAttemptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $testerId = Auth::user()->id;

        /**
         * BASE QUERY
         * forTester() is a scope in the TestAttempt model
         */
        $query = TestAttempt::query()
            ->forTester($testerId)
            // TODO ANDOR this line below does not work, because it confronts with the TestAttemptResource. How to fix this?
            ->with(['user:id,name', 'test:id,title,description']);

        /**
         * SEARCH
         *
         * filled() helper check if there is a search term, and if it is not '' empty string
         * If search term exist, we wrap it with the % wildcard for the LIKE query. If not, we set
         * it to nulL.
         */
        $searchTerm = $request->filled('searchTerm') ? "%{$request->searchTerm}%" : null;

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {

                // We search here for the test title
                $q->whereHas('test', fn ($t) => $t->where('title', 'like', $searchTerm))

                    // Or we search for the test taker name
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', $searchTerm));
            });
        }

        // SORT
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';

        // Only allow sorting by TestAttempt columns
        $allowedSorts = ['created_at', 'score_percentage', 'updated_at', 'id'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'created_at';

        $query->orderBy($sortBy, $sortOrder);

        // PAGINATE
        $perPage = $request->per_page ?? 2;
        $testsAttempts = $query->paginate($perPage);

        return TestAttemptResource::collection($testsAttempts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreTestAttemptRequest $request,
        TestAttemptEvaluatorInterface $evaluator
    ): TestAttemptResource {

        // Validate
        $validated = $request->validated();

        // Create the test attempt
        $testAttempt = TestAttempt::create($validated['test_attempt']);

        foreach ($validated['user_answers'] as $userAnswer) {
            UserAnswer::create([
                ...$userAnswer,
                'test_attempt_id' => $testAttempt->id,
            ]);
        }

        // Evaluate the test attempt
        $evaluator->evaluate($testAttempt);

        // Prepare the test attempt to be returned for the FE with belonging user answers
        $testAttempt->load('userAnswers');

        return new TestAttemptResource($testAttempt);
    }

    /**
     * Display the specified resource.
     */
    public function show(TestAttempt $testAttempt): TestAttemptResource
    {
        return new TestAttemptResource($testAttempt);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestAttemptRequest $request, TestAttempt $testAttempt): TestAttemptResource
    {
        $testAttempt->update($request->validated());

        return new TestAttemptResource($testAttempt);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TestAttempt $testAttempt): JsonResponse
    {
        $testAttempt->delete();

        return response()->json(['message' => 'Delete successful'], 200);
    }
}
