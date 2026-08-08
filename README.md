# TestTrack

**TestTrack is a longitudinal testing platform designed to track test-taker development over time.**

TestTrack is a portfolio project designed to make online testing easier for teachers, psychotherapists, HR professionals, and other people who regularly create and evaluate tests.

Instead of creating tests on paper, manually checking answers, calculating grades, and keeping track of previous results, TestTrack provides an online workflow where tests can be created, completed, evaluated, and stored for future analysis.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Flow](#user-flow)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Domain Model](#core-domain-model)
- [Database Relationships](#database-relationships)
- [Installation](#installation)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [CI/CD](#cicd)
- [MVP Scope](#mvp-scope)
- [Future Features](#future-features)
- [Project Status](#project-status)
- [License](#license)

---

## Overview

TestTrack is designed for people who need to test and evaluate other people, referred to throughout the project as **testers**.

Examples include:

- Teachers testing students
- Psychotherapists evaluating clients
- HR professionals testing job candidates
- Other professionals who need to create and evaluate tests

The main idea is not only to conduct a test, but to **store the results of multiple attempts over time**.

This makes it possible to compare previous attempts, analyse answers, and track the development of a test taker's knowledge, skills, or other measurable characteristics.

> **TestTrack is a longitudinal testing platform designed to track user development over time.**



## The workflow:

```text
Tester
  │
  ├── Login / Register
  │
  ├── Create Test
  │     ├── Add Questions
  │     └── Add Answer Options
  │
  └── Share Test via link
          │
          ▼
     Test Taker
          │
          ├── Uses the link, Login / Register
          │
          ├── Answer Questions
          │
          └── Submit Test
                  │
                  ▼
             Evaluation
                  │
                  ├── Score
                  ├── Feedback
                  └── Test Attempt
                          │
                          ▼
                     Progress Tracking
```

---

## Tech Stack

### Backend

- [PHP](https://www.php.net/)
- [Laravel](https://laravel.com/)
- Laravel REST API


### Frontend

- [Vue.js](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Element Plus](https://element-plus.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Testing & Code Quality

- [PHPUnit](https://phpunit.de/)
- [Larastan / PHPStan](https://phpstan.org/)
- PHP-CS-Fixer
- PHPMD
- [Playwright](https://playwright.dev/)

---

## Architecture

TestTrack uses a separated frontend/backend architecture.

```text
┌─────────────────────────┐
│       Vue.js SPA        │
│                         │
│ TypeScript              │
│ Element Plus            │
│ Tailwind CSS            │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│    Laravel Backend      │
│                         │
│ REST API                │
│ Authentication          │
│ Authorization           │
│ Business Logic          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        Database         │
└─────────────────────────┘
```

Users are assigned roles that determine whether they act as a **Tester** or **Test Taker**.

---



## Database Relationships

| # | Model A | Relationship | Model B |
|---|---|---|---|
| 1 | User (Tester) | hasMany | Test |
| 2 | User (Test Taker) | hasMany | TestAttempt |
| 3 | Test | hasMany | Question |
| 4 | Question | hasMany | AnswerOption |
| 5 | Test | hasMany | TestAttempt |
| 6 | TestAttempt | hasMany | UserAnswer |
| 7 | UserAnswer | belongsTo | TestAttempt |
| 8 | UserAnswer | belongsTo | Question |
| 9 | UserAnswer | belongsTo | AnswerOption |

---

## Installation


### Prerequisites

The application runs in Docker. You do **not** need to install PHP, MySQL, Node.js, or other application dependencies directly on your host machine.

You need:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Clone the repository

```bash
git clone https://github.com/Ranagol/test-track-be.git
cd test-track
```

### Start the application

Start the application using Docker Compose:

```bash
docker compose up -d --build
```

### Application setup

After the containers are running, install the Laravel application dependencies and initialize the database if required by the development setup.

```bash
docker compose exec app php artisan migrate
```

If the application uses seed data:

```bash
docker compose exec app php artisan db:seed
```

> The exact service name (`app`) depends on the service definition in `compose.yaml`. Use `docker compose ps` to see the available services.

The application is then available at:

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:8001`


### Running tests

The project uses several levels of automated testing and code quality checks.

#### PHP code quality

Laravel Pint:

```bash
./vendor/bin/pint --test
```

Larastan / PHPStan:

```bash
./vendor/bin/phpstan analyse --memory-limit=2G --no-progress
```

PHPMD:

```bash
XDEBUG_MODE=off ./vendor/bin/phpmd app ansi phpmd.xml
```

#### PHPUnit

PHPUnit tests use a MySQL database.

```bash
php artisan test --compact
```

#### Frontend type checking

```bash
cd test-track-fe
npm run type-check
```

#### Playwright

Install the Playwright browsers:

```bash
cd test-track-fe
npx playwright install
```

Run the end-to-end tests:

```bash
npx playwright test
```

## CI/CD

The project uses [GitHub Actions](https://github.com/features/actions) for continuous integration.

The CI workflow runs on:

- pushes to the `main` branch
- pull requests targeting the `main` branch

The workflow performs:

1. Laravel Pint
2. Larastan
3. PHPMD
4. PHPUnit tests with separate MySQL test database
5. TypeScript type checking
6. Playwright end-to-end tests

The production deployment is performed on an Oracle Cloud VM.

The deployment process:

```text
GitHub
   │
   ├── CI checks
   │
   └── main branch
          │
          ▼
   Oracle Cloud VM
          │
          ├── git pull origin main
          │
          └── docker compose -f compose.prod.yaml up -d --build
```

The production application is therefore run using the production Docker Compose configuration:

```bash
docker compose -f compose.prod.yaml up -d --build
```


---

## MVP Scope

TestTrack is primarily a **portfolio project**.

The goal is to build and deploy a functional MVP within a limited development period while demonstrating a professional full-stack development workflow.

The MVP focuses on:

- Test creation
- Question and answer management
- Test submission
- Automatic evaluation
- Test attempt storage
- User tesrs result tracking, comparing, visually displaying

The project also demonstrates:

- REST API development
- Database design
- Vue.js frontend development
- Automated testing
- CI/CD
- Cloud deployment

> The emphasis is on fast delivery of a simple, maintainable, and good-looking portfolio application. Because of this, there a lot of desired features, that will be done in the future.

---

## Future Features


- Question difficulty analysis
- Weak-topic detection
- Per-question success rates
- Multidimensional personality tests
- Solutions for answering (cheating) with AI
- Questions defined by a picture, not a text
- Inviting test takers by email



---

## Project Status

**MVP in development.**

The project is being developed incrementally, with the initial focus on completing the core testing workflow.

Additional features will be added after the MVP is deployed.

---

## License

This project is currently intended as a portfolio project.
