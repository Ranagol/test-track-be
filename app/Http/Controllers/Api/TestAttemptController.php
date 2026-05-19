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

        $query = TestAttempt::query()

            // Give me TestAttempts where the test belongs to the currently authenticated tester
            ->whereHas('test', function ($q) use ($testerId) {
                $q->where('user_id', $testerId);
            })
            ->with([
                'user:id,name',
                'test:id,title,description',
            ]);

        // Search by title or test taker name
        // if ($request->has('search') && $request->search !== '') {
        //     $query->whereHas('test', function ($q) use ($request) {
        //         $q->where('title', 'like', '%' . $request->search . '%');
        //     })->orWhereHas('user', function ($q) use ($request) {
        //         $q->where('name', 'like', '%' . $request->search . '%');
        //     });
        // }

        // Sort
        // $sortBy = $request->sort_by ?? 'created_at';
        // $sortOrder = $request->sort_order ?? 'desc';
        // $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';

        // // If sorting by test columns, join the tests table
        // if (in_array($sortBy, ['title', 'description'])) {
        //     $query->join('tests', 'test_attempts.test_id', '=', 'tests.id')
        //         ->select('test_attempts.*')
        //         ->orderBy('tests.' . $sortBy, $sortOrder);
        // } else {
        //     $query->orderBy($sortBy, $sortOrder);
        // }

        // Paginate
        // $perPage = $request->per_page ?? 2;
        $testsAttempts = $query->paginate(10);

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
