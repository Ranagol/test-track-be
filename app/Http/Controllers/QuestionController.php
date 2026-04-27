<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
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
}
