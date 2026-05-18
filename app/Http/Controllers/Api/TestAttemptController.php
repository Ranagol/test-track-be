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
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TestAttemptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        return TestAttemptResource::collection(TestAttempt::paginate());
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
