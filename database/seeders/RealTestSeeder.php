<?php

namespace Database\Seeders;

use App\Models\AnswerOption;
use App\Models\Question;
use App\Models\Test;
use App\Models\User;
use Illuminate\Database\Seeder;

class RealTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        /**
         * Create a specific test for the tester with email tester@gmail.com
         * This test will be used for testing the evaluation logic. So we must have here
         * concrete and meaningful questions and answer options.
         */
        $tester = User::role('tester')->where('email', 'tester@gmail.com')->first();

        $this->createMathTest($tester);
        $this->createLiteratureTest($tester);
    }

    private function createMathTest(User $tester): void
    {
        $mathTest = Test::factory()->for($tester)->create([
            'title' => 'Math test',
            'description' => 'A very difficult math test',
        ]);

        $question1 = Question::factory()->for($mathTest)->create([
            'text' => 'What is 2 + 2?',
        ]);

        AnswerOption::factory()->for($question1)->create(
            [
                'text' => '4',
                'is_correct' => true,
            ]);

        AnswerOption::factory()->for($question1)->create(['text' => '3']);
        AnswerOption::factory()->for($question1)->create(['text' => '5']);

        $question2 = Question::factory()->for($mathTest)->create([
            'text' => 'What is 5 * 3?',
        ]);

        AnswerOption::factory()->for($question2)->create(
            [
                'text' => '15',
                'is_correct' => true,
            ]);

        AnswerOption::factory()->for($question2)->create(['text' => '10']);
        AnswerOption::factory()->for($question2)->create(['text' => '20']);

        $question3 = Question::factory()->for($mathTest)->create([
            'text' => 'What is 10 / 2?',
        ]);

        AnswerOption::factory()->for($question3)->create(
            [
                'text' => '5',
                'is_correct' => true,
            ]);

        AnswerOption::factory()->for($question3)->create(['text' => '2']);
        AnswerOption::factory()->for($question3)->create(['text' => '10']);
    }

    private function createLiteratureTest(User $tester): void
    {
        $literatureTest = Test::factory()->for($tester)->create([
            'title' => 'Literature test',
            'description' => 'A sample literature test',
        ]);

        $question1 = Question::factory()->for($literatureTest)->create([
            'text' => 'Who wrote "Pride and Prejudice"?',
        ]);

        AnswerOption::factory()->for($question1)->create(
            [
                'text' => 'Jane Austen',
                'is_correct' => true,
            ]);

        AnswerOption::factory()->for($question1)->create(['text' => 'Charlotte Brontë']);
        AnswerOption::factory()->for($question1)->create(['text' => 'Mary Shelley']);

        $question2 = Question::factory()->for($literatureTest)->create([
            'text' => 'Who is the author of "The Great Gatsby"?',
        ]);

        AnswerOption::factory()->for($question2)->create(
            [
                'text' => 'F. Scott Fitzgerald',
                'is_correct' => true,
            ]);

        AnswerOption::factory()->for($question2)->create(['text' => 'Ernest Hemingway']);
        AnswerOption::factory()->for($question2)->create(['text' => 'John Steinbeck']);

        $question3 = Question::factory()->for($literatureTest)->create([
            'text' => 'Who wrote "To Kill a Mockingbird"?',
        ]);

        AnswerOption::factory()->for($question3)->create(
            [
                'text' => 'Harper Lee',
                'is_correct' => true,
            ]);

        AnswerOption::factory()->for($question3)->create(['text' => 'Mark Twain']);
        AnswerOption::factory()->for($question3)->create(['text' => 'Ernest Hemingway']);
    }
}
