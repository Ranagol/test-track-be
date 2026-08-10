<template>

    <!-- Hero -->
    <div class="text-center mb-16">

        <h1 class="text-3xl font-bold mt-8">

            Welcome to Test Track! Buuut... what is it?

            <RouterLink
                class="text-blue-500 hover:text-blue-700 underline"
                to="/quick-start"
            >
                How to use it?
            </RouterLink>
        </h1>

        <p class="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            TestTrack is a longitudinal testing platform that helps teachers,
            psychotherapists, HR professionals, and other specialists create,
            evaluate, and track assessments over time.
        </p>

        <h1 class="text-3xl font-bold mb-6 mt-5">

            Track progress, not just test results.

            <RouterLink
                class="text-blue-500 hover:text-blue-700 underline"
                to="/tests/create"
            >
                Start here!
            </RouterLink>
        </h1>

    </div>


    <!-- Problem -->
    <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">
            The problem
        </h2>

        <p class="text-gray-700 mb-4">
            Many professionals use tests to assess knowledge, skills, abilities,
            personality traits, or development. However, traditional paper-based
            testing often requires a large amount of repetitive manual work:
            distributing tests, checking answers, calculating scores, recording
            results, and comparing performance over time.
        </p>

        <p class="text-gray-700">
            The biggest challenge is not only creating a test, but understanding
            how a person develops over time.
        </p>
    </div>


    <!-- Solution -->
    <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">
            The solution
        </h2>

        <p class="text-gray-700 mb-4">
            TestTrack brings testing online and automates the repetitive parts
            of the evaluation process. Professionals can create digital tests,
            share them with test takers, automatically evaluate responses,
            calculate scores, and store results in one place.
        </p>

        <p class="text-gray-700">
            Unlike many testing platforms that focus only on one-time assessments,
            TestTrack is designed for continuous tracking and development.
        </p>
    </div>


    <!-- Features -->
    <div class="grid md:grid-cols-4 gap-6 mb-12">

        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3">
                <router-link
                    class="text-blue-500 hover:text-blue-700 underline"
                    to="/tests/create"
                >
                    Create online tests
                </router-link>
            </h3>

            <p class="text-gray-600">
                Create structured assessments with questions, answers, and
                automatic evaluation rules.
            </p>
        </div>

        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3">
                Invite your test takers
            </h3>

            <p class="text-gray-600">
                Easily invite test takers via shareable links.
            </p>
        </div>

        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3">
                Automatic evaluation
            </h3>

            <p class="text-gray-600">
                TestTrack will automatically check answers, calculate scores,
                and provide immediate feedback when needed.
            </p>
        </div>

        <div class="border rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3">
                Track development over time
            </h3>

            <p class="text-gray-600">
                You can store previous test attempts, scores, and results to follow progress
                and identify improvement trends.
            </p>
        </div>

    </div>


    <!-- Longitudinal tracking -->
    <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">
            From testing to development
        </h2>

        <p class="text-gray-700 mb-4">
            TestTrack transforms testing from a single evaluation into a
            continuous development process.
        </p>

        <p class="text-gray-700">
            Teachers can monitor student progress, therapists can track changes
            during a process, and HR professionals can follow candidate or
            employee development through historical testing data.
        </p>
    </div>

    <!-- Closing -->
    <div class="text-center mt-16 mb-5">
        <p class="text-xl font-semibold">
            TestTrack helps professionals understand not only where someone is
            today, but how they are developing over time.
        </p>
    </div>

    <br>

</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';


</script>

<style scoped></style>
