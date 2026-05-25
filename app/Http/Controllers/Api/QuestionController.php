<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        return QuestionResource::collection(Question::paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionRequest $request): QuestionResource
    {
        $question = Question::create($request->validated());

        return new QuestionResource($question);
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question): QuestionResource
    {
        return new QuestionResource($question);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question): QuestionResource
    {
        $question->update($request->validated());

        return new QuestionResource($question);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question): JsonResponse
    {
        $question->delete();

        return response()->json(['message' => 'Delete successful'], 200);
    }

    public function setCorrectAnswer(Question $question, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'correct_answer_option_id' => [
                'required',
                'exists:answer_options,id',
            ],
        ]);

        $correctAnswerId = $validated['correct_answer_option_id'];

        // Check if the provided answer option ID belongs to the question
        $belongsToQuestion = $question->answerOptions()
            ->where('id', $correctAnswerId)
            ->exists();
        abort_if(! $belongsToQuestion, 422);

        // Set all to false
        $question->answerOptions()->update(['is_correct' => false]);

        // Set selected one to true
        $question->answerOptions()->where('id', $correctAnswerId)->update(['is_correct' => true]);

        return response()->json([
            'message' => 'Correct answer updated.',
        ]);

    }
}
