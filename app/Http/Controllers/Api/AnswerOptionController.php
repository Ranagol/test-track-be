<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnswerOptionRequest;
use App\Http\Resources\AnswerOptionResource;
use App\Models\AnswerOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AnswerOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        return AnswerOptionResource::collection(AnswerOption::paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnswerOptionRequest $request): AnswerOptionResource
    {
        $answerOption = AnswerOption::create($request->validated());

        return new AnswerOptionResource($answerOption);
    }

    /**
     * Display the specified resource.
     */
    public function show(AnswerOption $answerOption): AnswerOptionResource
    {
        return new AnswerOptionResource($answerOption);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AnswerOption $answerOption): JsonResponse
    {
        $answerOption->delete();

        return response()->json(['message' => 'Delete successful'], 200);
    }
}