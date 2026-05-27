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
     * Display all belonging test on the /tests page.
     *
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
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        // If $sortOrder is either 'asc' or 'desc', keep it. Otherwise, default to 'desc'.
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->per_page ?? 2;
        $tests = $query->paginate($perPage);

        // TODO ANDOR later check this, and only return those columns that you actually need on FE. Use nested eager loading.
        return TestResource::collection($tests);
    }

    /**
     * This function is called at FE url /analytics/:testTakerId
     * It sends all belonging tests, questions, answers, attempts for the give test taker, so its
     * test performances could be analyzed.
     */
    public function indexAnalytics(Request $request): AnonymousResourceCollection
    {
        $testTakerId = $request->testTakerId;

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
            ->get();

        return TestResource::collection($tests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTestRequest $request): TestResource
    {
        $validatedData = $request->validated();

        // Create unique test code
        $testCode = $this->generateUniqueTestCode();

        // Add the generated test code to the validated data
        $validatedData['test_code'] = $testCode;

        $test = Test::create($validatedData);

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

    // TODO ANDOR why would this string $testCode work for extracting test code? How? What is sending the FE?
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

    private function generateUniqueTestCode(): string
    {
        // Get all existing test codes
        $existingCodes = Test::pluck('test_code');

        // This is the new test code
        $code = 'TEST-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(1)));

        // Check if the new test code accidentally already exists, untill we have a unique one
        while ($existingCodes->contains($code)) {

            // If the new code already exists, generate a new new one
            $code = 'TEST-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(1)));
        }

        return $code;
    }
}