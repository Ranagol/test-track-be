<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserAnswerRequest;
use App\Http\Requests\UpdateUserAnswerRequest;
use App\Http\Resources\UserAnswerResource;
use App\Models\UserAnswer;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class UserAnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $userAnswers = UserAnswer::with(['testAttempt', 'question', 'answerOption'])
            ->paginate(10);

        return UserAnswerResource::collection($userAnswers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserAnswerRequest $request): UserAnswerResource
    {
        $userAnswer = UserAnswer::create($request->validated());

        return new UserAnswerResource($userAnswer->load(['testAttempt', 'question', 'answerOption']));
    }

    /**
     * Display the specified resource.
     */
    public function show(UserAnswer $userAnswer): UserAnswerResource
    {
        return new UserAnswerResource(
            $userAnswer->load(['testAttempt', 'question', 'answerOption'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserAnswerRequest $request, UserAnswer $userAnswer): UserAnswerResource
    {
        $userAnswer->update($request->validated());

        return new UserAnswerResource(
            $userAnswer->load(['testAttempt', 'question', 'answerOption'])
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserAnswer $userAnswer): Response
    {
        $userAnswer->delete();

        return response()->noContent();
    }
}
