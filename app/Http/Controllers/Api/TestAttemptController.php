<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTestAttemptRequest;
use App\Http\Resources\TestAttemptResource;
use App\Models\TestAttempt;
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
    public function store(StoreTestAttemptRequest $request): TestAttemptResource
    {
        $testAttempt = TestAttempt::create($request->validated());

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
