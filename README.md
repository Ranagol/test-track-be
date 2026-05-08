# TestTracker docs

## Table of Contents

1. [App idea - TestTracker description](#app-idea---testtracker-description)
2. [User flow - how the app works](#user-flow---how-the-app-works)
3. [Goal](#goal)
4. [Technical background](#technical-background)
5. [App keywords (models)](#app-keywords-models)
   - 5.1 [User](#user)
   - 5.2 [Class - NOT MVP](#class---not-mvp)
   - 5.3 [Course - NOT MVP](#course---not-mvp)
   - 5.4 [Test](#test)
   - 5.5 [Question](#question)
   - 5.6 [AnswerOption](#answeroption)
   - 5.7 [TestAttempt](#testattempt)
   - 5.8 [UserAnswer](#useranswer)
6. [Relationships](#relationships)
7. [Copilot instructions](#copilot-instructions)
8. [Steps](#steps)
9. [Ideas for after-MVP](#ideas-for-after-mvp)

---

## App idea - TestTracker description

**App name:** TestTracker

The basic idea of this app is to make life easier for teachers, psychotherapists, HRs — people who have to make tests for clients, students, job candidates, and then check and grade these tests individually, often on paper. We will call these teachers, psychotherapists, HRs, etc: **testers**, because they test people.

The basic idea is that the test should be online, it should check itself and grade the test taker's performance, and (when needed) give immediate feedback. Grades and tests will be remembered by the app, so the tester can have an overview of their test takers, grades, answers, and even follow if there is improvement. The tester can view each test taker's previous attempts, including scores and dates, allowing simple tracking of progress over time.

Now, there are many tester apps online already. The difference is that they are for one-time testing. This app can be used for that too, but its core purpose is to remember test performance/grades for test takers so this data can be used for analytics. This way the teacher/therapist/HR can follow the development of the skill/knowledge/trait of the test taker.

> **TestTracker is a longitudinal testing platform designed to track user development over time.**

---

## User flow - how the app works

- Tester logs in, registers.
- Tester creates a test. Test will have questions, and questions will have AnswerOptions (one, or some of them are correct). Test has a test code.
- Test taker logs in/registers. Test takers receive the test code from the tester, and this way they can enter into the testing process.
- Test taker goes over the questions, clicks the answer.
- Submit.
- Depending on how the tester created the test (`giveFeedback`, `doGrades`, etc.) the app might give feedback about the success and grades — or it might just confirm: "test successfully completed and submitted."
- Analytics: the tester can have an overview of all their belonging classes, test takers, grades, answers, and progression. Can make comments on how to proceed.
- The test taker could retake the same tests over time, if needed, to follow improvements.
- Each attempt is stored.
- The system compares attempts and tracks progress.

---

## Goal

This is meant to be a portfolio app, done by one person, in a limited time — 20 days max with all the complications, together with deployment. The goal is to have a functional, deployed MVP with some basic-minimum-needed features to show to possible future employers. Later, once the app is running, new features can be added to make the app stand out. The app will be deployed on Oracle Cloud.

> Accent is on fast delivery of a simple, not complicated, but still good-looking portfolio MVP.

---

## Technical background

We use separate backend and frontend.

- **BE:** Laravel (Roles and permissions from Spatie will be used)
- **FE:** Vue.js + TypeScript, with Element Plus and Tailwind

---

## App keywords (models)

### User

We will use Spatie Roles and Permissions package. Users can have roles as Tester or TestTaker.

- **Tester:** users who need to test other users
- **TestTaker:** users who must be tested

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `name` | string |
| `email` | string, unique |
| `password` | string |
| `role` | enum: `tester`, `test_taker` |
| `timestamps` | — |

---

### Class - NOT MVP

A group of users who need to take the same test. Useful for group results and group feedback, but not needed for MVP.

---

### Course - NOT MVP

History, Biology, Chemistry... Personality tests, pathology tests... A group of tests. This is a feature for after the MVP phase.

---

### Test

The most important model. A Test has Questions. Questions can be written or an image. Questions can have many offered answers, but only one (or some) can be correct.

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `user_id` | FK → `users.id` (tester) |
| `title` | string |
| `description` | text, nullable |
| `test_code` | string, unique |
| `timestamps` | — |

---

### Question

Questions can be verbal, or an image can be uploaded to describe a situation. Image support is a post-MVP feature.

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `test_id` | FK → `tests.id` |
| `text` | text |
| `image_path` | string, nullable |
| `allows_multiple_correct` | boolean, default `false` — controls checkbox vs radio rendering |
| `question_order` | integer, nullable — for future reordering |
| `timestamps` | — |

---

### AnswerOption

Belongs to a given question. Can be a correct or incorrect answer.

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `question_id` | FK → `questions.id` |
| `text` | string |
| `is_correct` | boolean |
| `answer_order` | integer, nullable — for future reordering |
| `timestamps` | — |

---

### TestAttempt

Belongs to a User with role `test_taker` and a Test. Records the result. Crucial for analytics.

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `user_id` | FK → `users.id` |
| `test_id` | FK → `tests.id` |
| `score` | integer, nullable |
| `max_score` | integer, nullable |
| `comment` | text, nullable |
| `started_at` | timestamp, nullable |
| `completed_at` | timestamp, nullable |
| `timestamps` | — |

---

### UserAnswer

Breaks a test attempt into individual question-level data.

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `test_attempt_id` | FK → `test_attempts.id` |
| `question_id` | FK → `questions.id` |
| `answer_option_id` | FK → `answer_options.id` |
| `comment` | text, nullable |
| `timestamps` | — |

**Relationships:**

- `UserAnswer` belongsTo `TestAttempt`
- `UserAnswer` belongsTo `Question`
- `UserAnswer` belongsTo `AnswerOption`
- `TestAttempt` hasMany `UserAnswer`
- `Question` hasOne `UserAnswer`
- `AnswerOption` hasOne `UserAnswer`

**Conceptually:**

```
TestAttempt = "when did they take the test + score"
UserAnswer  = "what exactly did they do in that attempt"
```

**Why UserAnswer matters:**

🔍 **1. Show full test review**

| Question | User Answer | Correct? |
|---|---|---|
| Q1 | A | ✔ |
| Q2 | C | ❌ |
| Q3 | B | ✔ |

📊 **2. Enable real analytics later**

- Hardest questions
- Weak topics
- Per-question success rate

🧠 **3. Support learning features (future-proofing)**

- Explanations per question
- "Why wrong" feedback
- Adaptive testing

🔁 **4. Recalculate scores anytime**

- Without UserAnswer: ❌ impossible
- With UserAnswer: ✔ recompute everything from raw data

🧩 **Relationship structure:**

```
User
  ↓
TestAttempt  (one exam submission)
  ↓
UserAnswer   (each question response)
```

> 1 attempt = many answers

---

## Relationships

| # | Model A | Relationship | Model B |
|---|---|---|---|
| 1 | User (tester) | hasMany | Test |
| 2 | User (test-taker) | hasMany | TestAttempt |
| 3 | Test | hasMany | Question |
| 4 | Question | hasMany | AnswerOption |
| 5 | Test | hasMany | TestAttempt |
| 6 | UserAnswer | belongsTo | TestAttempt |
| 7 | UserAnswer | belongsTo | Question |
| 8 | UserAnswer | belongsTo | AnswerOption |

---

## Copilot instructions

### Create model, controller, request, route, migration, seeder, factory, etc.

Please generate a Laravel REST API implementation for a model named `UserAnswer`.

**Requirements:**

**1. Model**

- Must include: `protected $guarded = ['id'];`
- Define relationships:
  - `UserAnswer` belongsTo `TestAttempt`
  - `UserAnswer` belongsTo `Question`
  - `UserAnswer` belongsTo `AnswerOption`
  - `TestAttempt` hasMany `UserAnswer`
  - `Question` hasOne `UserAnswer`
  - `AnswerOption` hasOne `UserAnswer`

**2. Database Migration**

Create table `user_answers` with:

| Field | Type |
|---|---|
| `id` | bigint, PK |
| `test_attempt_id` | FK → `test_attempts.id` |
| `question_id` | FK → `questions.id` |
| `answer_option_id` | FK → `answer_options.id` |
| `comment` | text, nullable |
| `timestamps` | — |

**3. API Layer**

- Create a REST API controller using `php artisan make:controller --api`
- Use Laravel API resource routes in `routes/api.php` (`Route::apiResource`)

**4. Form Request**

- Create a `FormRequest` for store and update
- Include validation rules for all fields

**5. Resource**

- Create a Laravel API Resource for consistent JSON output

**6. Factory**

- Generate a factory that respects schema constraints

**7. Seeder**

- Create a seeder that inserts 3 records using the factory

**Notes:**

- This is a REST API-only project (no views)
- Follow Laravel best practices and naming conventions
- Ensure all foreign keys and relationships are properly defined
- When these new files are created, at the end, check them with Larastan
- Double-check that all requested files have been created

---

## Steps

- Create all models, controllers, CRUD logic, tables, requests, routes, etc.
- Auth scaffolding
- Install Spatie permissions, Laravel AI package
- Create seeders with some specific test testers and test takers, and some specific pre-defined questions and answers
- Start adding core features (create tests, answering questions...) with Postman. Can Postman be used as a kind of E2E tester to check if all backend functions work? If so, automate this early.

---

## Ideas for after-MVP

*(To be filled in)*

---

*END*
