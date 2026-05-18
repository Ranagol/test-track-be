<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Http\Resources\TestResource;
use App\Models\Test;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     * TestResource is for single resources. TestResource::collection(), returns an
     * AnonymousResourceCollection — which is the collection wrapper that handles pagination,
     * metadata, and multiple items.
     * This is an example of the GET request:
     * /api/tests?page=1&per_page=2&search=&sort_by=title&sort_order=asc
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = Auth::user();
        $query = Test::where('user_id', $user->id);

        // Search by title
        if ($request->has('search') && $request->search !== '') {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        // Sort
        $sortBy = $request->sort_by ?? 'title';
        $sortOrder = $request->sort_order ?? 'desc';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->per_page ?? 2;
        $tests = $query->paginate($perPage);

        return TestResource::collection($tests);
    }

    /**
     * Store a newly created resource in storage.
     * //TODO ANDOR when a new test is created from data sent from FE, we will have to create manually
     * a unique test code.
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
        // Eager load questions and their answer options for this test
        $test->load('questions.answerOptions');

        return new TestResource($test);
    }

    // TODO ANDOR why would this string $testCode work for extracting test code? How?
    public function getTestByCode(string $testCode): TestResource
    {
        $test = Test::where('test_code', $testCode)
            ->with('questions.answerOptions')
            ->firstOrFail();

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
