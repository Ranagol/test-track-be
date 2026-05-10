<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Http\Resources\TestResource;
use App\Models\Test;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     * TestResource is for single resources. TestResource::collection(), returns an
     * AnonymousResourceCollection — which is the collection wrapper that handles pagination,
     * metadata, and multiple items.
     */
    public function index(): AnonymousResourceCollection
    {
        $user = Auth::user();
        $tests = Test::where('user_id', $user->id)->paginate(10);

        return TestResource::collection($tests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTestRequest $request): TestResource
    {
        $test = Test::create($request->validated());

        return new TestResource($test);
    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test): TestResource
    {
        return new TestResource($test);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestRequest $request, Test $test): TestResource
    {
        $test->update($request->validated());

        return new TestResource($test);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test): JsonResponse
    {
        $test->delete();

        return response()->json(['message' => 'Delete successful'], 200);
    }
}
