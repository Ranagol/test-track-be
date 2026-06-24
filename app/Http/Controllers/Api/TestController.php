<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Http\Resources\TestResource;
use App\Interfaces\TestControllerServiceInterface;
use App\Models\Test;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    private TestControllerServiceInterface $testControllerService;

    public function __construct(TestControllerServiceInterface $testControllerService)
    {
        $this->testControllerService = $testControllerService;
    }

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
        // Validate the request data
        $validatedData = $request->validated();

        // Create the test
        $test = $this->testControllerService->createTest($validatedData);

        // Create questions (and their answer options) for the test
        $this->testControllerService->createQuestions($validatedData['questions'], $test);

        return new TestResource($test);
    }

    /**
     * Update the specified resource in storage. We receive here a test2, together with its
     * questions and answer options. We have to loop through all this and handle.
     */
    public function update(UpdateTestRequest $request, Test $test): TestResource
    {
        // Validate the request data
        $validatedData = $request->validated();

        // Update the test
        $this->testControllerService->updateTest($validatedData, $test);

        // Rehydrate the test model, with its questions and answer options to reflect the updated data
        $test->refresh()->load('questions.answerOptions');

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

    public function getTestByCode(string $testCode): TestResource
    {
        $test = Test::where('test_code', $testCode)
            ->with('questions.answerOptions')
            ->firstOrFail();

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