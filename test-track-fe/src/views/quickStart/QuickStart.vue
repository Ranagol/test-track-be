<template>
    <div class="max-w-5xl mx-auto px-6 py-10">

        <!-- HEADER -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">
                Quick Start
            </h1>

            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                Follow these steps to experience the complete TestTrack workflow,
                from creating a test to reviewing a test taker's results.
            </p>
        </div>


        <!-- STEP 1 -->
        <section class="mb-12">

            <h2 class="text-2xl font-bold mb-4">
                1. 🧑‍💼

                <router-link
                    class="text-blue-500 hover:text-blue-700 underline"
                    to="/login"
                >
                    Log in
                </router-link>

                or

                <router-link
                    class="text-blue-500 hover:text-blue-700 underline"
                    to="/register"
                >
                    register as a tester.
                </router-link>

            </h2>


        </section>


        <!-- STEP 2 -->
        <section class="mb-12">

            <h2 class="text-2xl font-bold mb-4">
                2. 📝 Create your test
            </h2>

            <p class="text-gray-700 mb-4">
                After logging in as a tester,

                <router-link
                    class="text-blue-500 hover:text-blue-700 underline"
                    to="/tests/create"
                >
                    create a new test.
                </router-link>
            </p>

            <p class="text-gray-700 mb-4">
               Add a title, description, questions, and answer options to your test. For each question,
               mark the correct answer. Each question can have only one correct answer.
            </p>

            <p class="text-gray-700 mb-6">
                Save the test when you are finished.
            </p>

            <!-- Screenshot -->
            <img
                src="@/assets/images/quick-start/02-create-new-test.png"
                alt="Creating a new test in TestTrack"
                class="w-full rounded-lg border"
            />
        </section>


        <!-- STEP 3 -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4">
                3. 🔗 Copy the invitation link
            </h2>

            <p class="text-gray-700 mb-4">
                You can find all your tests in the
                <router-link
                    class="text-blue-500 hover:text-blue-700 underline"
                    to="/tests"
                >
                    "My Tests"
                </router-link>
                area. After creating a test, you will also be automatically redirected there.
                Every test has its own invitation link. Copy this link and share it with the people
                who need to take the test.
            </p>

            <p class="text-gray-700 mb-6">
                For this quick-start demonstration, copy the link and open it in an incognito/private
                browser window. This allows you to use the test as a separate test taker while staying
                logged in to your tester account.
            </p>

            <!-- Screenshot -->
            <img
                src="@/assets/images/quick-start/03-invite.png"
                alt="Test invitation link"
                class="w-full rounded-lg border"
            />
        </section>


        <!-- STEP 4 -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4">
                4. 🧑‍🎓 Log in/register as a test taker
            </h2>

            <p class="text-gray-700 mb-4">
                Open the invitation link in the incognito/private window and register as a test taker.
                For this demonstration, you can use a fictional test taker account.

                A tester is someone who creates and manages tests, such as a teacher, psychologist,
                or HR professional. A Test taker is someone who takes a test, such as a student,
                employee, or client.
            </p>

        </section>


        <!-- STEP 5 -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4">
                5. ✅ Complete the test
            </h2>

            <p class="text-gray-700 mb-4">
                Select an answer for each question and submit the test.
            </p>

            <!-- Screenshot -->
            <img
                src="@/assets/images/quick-start/05-solve-test3.png"
                alt="Test taker completing a test"
                class="w-full rounded-lg border"
            />
        </section>


        <!-- STEP 6 -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4">
                6. 📊 Find the completed test
            </h2>

            <p class="text-gray-700 mb-4">

                After the test taker (you) has "submitted" the test, return to your tester account. Go to

                <router-link
                    class="text-blue-500 hover:text-blue-700 underline"
                    to="/test-takers"
                >
                    Test Takers
                </router-link>

                to view the result of the test attempt.
            </p>

            <p class="text-gray-700 mb-6">
                Here you can see all your test takers and their test attempts. In this example, there
                is one test taker with one test attempt. Click the test taker's name to view the attempt.
            </p>

            <!-- Screenshot -->
            <img
                src="@/assets/images/quick-start/06-find.png"
                alt="tester view of test takers and test attempts"
                class="w-full rounded-lg border"
            />
        </section>


        <!-- STEP 7 -->
        <section class="mb-12">

            <h2 class="text-2xl font-bold mb-4">
                7. 📈 Review and compare results
            </h2>

            <p class="text-gray-700 mb-4">
                You can see the test score, the answers given, the date of the attempt, and which
                answers were correct (green background) or incorrect (red background).
            </p>

            <p class="text-gray-700 mb-4">
                You can also compare multiple test attempts from the same test taker over time. For
                example, you could give the same test again a month later to see whether the test
                taker has improved.

                This is called longitudinal tracking. Because TestTrack stores previous attempts,
                you can review and compare a test taker's performance over time.
            </p>

            <!-- Screenshot -->
            <img
                src="@/assets/images/quick-start/07-longitudinal.png"
                alt="Test result and test attempt history"
                class="w-full rounded-lg border"
            />
        </section>


        <!-- FINISH -->
        <section class="text-center border-t pt-10 mt-16">
            <h2 class="text-2xl font-bold mb-4">
                That's it!
            </h2>

            <p class="text-gray-600 max-w-2xl mx-auto">
                You have now experienced the complete TestTrack workflow:
                create a test, invite a test taker, complete the test,
                and review the results.
            </p>
        </section>

    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>

