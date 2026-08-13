<template>

    <!-- Hero -->
    <div class="hero text-center mb-16 pt-12 pb-10">

        <h1 class="text-4xl font-bold">
            Track progress, not just <span class="text-brand">test results</span>.
        </h1>

        <p class="text-xl text-text-soft max-w-3xl mx-auto mt-6">
            TestTrack is a longitudinal testing platform that helps teachers,
            psychotherapists, HR professionals, and other specialists create,
            evaluate, and track assessments over time.
        </p>

        <div class="flex justify-center gap-4 mt-8">
            <router-link to="/tests/create">
                <el-button
                    type="primary"
                    size="large"
                >
                    Start here
                    <el-icon class="ml-1"><Right /></el-icon>
                </el-button>
            </router-link>

            <router-link to="/quick-start">
                <el-button size="large">
                    <el-icon class="mr-1"><QuestionFilled /></el-icon>
                    How to use it?
                </el-button>
            </router-link>
        </div>

    </div>


    <!-- Problem & Solution -->
    <div class="grid md:grid-cols-2 gap-6 mb-12">

        <div class="info-panel">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
                <el-icon class="text-warning"><WarningFilled /></el-icon>
                The problem
            </h2>

            <p class="text-text-soft mb-4">
                Many professionals use tests to assess knowledge, skills, abilities,
                personality traits, or development. However, traditional paper-based
                testing often requires a large amount of repetitive manual work:
                distributing tests, checking answers, calculating scores, recording
                results, and comparing performance over time.
            </p>

            <p class="text-text-soft">
                The biggest challenge is not only creating a test, but understanding
                how a person develops over time.
            </p>
        </div>

        <div class="info-panel">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
                <el-icon class="text-success"><CircleCheckFilled /></el-icon>
                The solution
            </h2>

            <p class="text-text-soft mb-4">
                TestTrack brings testing online and automates the repetitive parts
                of the evaluation process. Professionals can create digital tests,
                share them with test takers, automatically evaluate responses,
                calculate scores, and store results in one place.
            </p>

            <p class="text-text-soft">
                Unlike many testing platforms that focus only on one-time assessments,
                TestTrack is designed for continuous tracking and development.
            </p>
        </div>

    </div>


    <!-- Features -->
    <div class="grid md:grid-cols-4 gap-6 mb-12">

        <router-link
            to="/tests/create"
            class="feature-card"
        >
            <el-icon class="feature-icon"><EditPen /></el-icon>

            <h3 class="text-xl font-semibold mb-3">
                Create online tests
            </h3>

            <p class="text-text-soft">
                Create structured assessments with questions, answers, and
                automatic evaluation rules.
            </p>
        </router-link>

        <div class="feature-card">
            <el-icon class="feature-icon"><Share /></el-icon>

            <h3 class="text-xl font-semibold mb-3">
                Invite your test takers
            </h3>

            <p class="text-text-soft">
                Easily invite test takers via shareable links.
            </p>
        </div>

        <div class="feature-card">
            <el-icon class="feature-icon"><MagicStick /></el-icon>

            <h3 class="text-xl font-semibold mb-3">
                Automatic evaluation
            </h3>

            <p class="text-text-soft">
                TestTrack will automatically check answers, calculate scores,
                and provide immediate feedback when needed.
            </p>
        </div>

        <div class="feature-card">
            <el-icon class="feature-icon"><TrendCharts /></el-icon>

            <h3 class="text-xl font-semibold mb-3">
                Track development over time
            </h3>

            <p class="text-text-soft">
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

        <p class="text-text-soft mb-4">
            TestTrack transforms testing from a single evaluation into a
            continuous development process.
        </p>

        <p class="text-text-soft">
            Teachers can monitor student progress, therapists can track changes
            during a process, and HR professionals can follow candidate or
            employee development through historical testing data.
        </p>
    </div>

    <!-- Closing -->
    <div class="closing-panel text-center mt-16 mb-5">
        <p class="text-xl font-semibold">
            TestTrack helps professionals understand not only where someone is
            today, but how they are developing over time.
        </p>
    </div>

</template>

<script setup lang="ts">
import {
    Right,
    QuestionFilled,
    WarningFilled,
    CircleCheckFilled,
    EditPen,
    Share,
    MagicStick,
    TrendCharts
} from '@element-plus/icons-vue';
</script>

<style scoped>

.hero {
    border-bottom: 1px solid var(--color-border-light);
}

.text-brand {
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.info-panel {
    background: var(--color-surface-soft);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
}

.feature-card {
    display: block;
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    color: inherit;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
}

a.feature-card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-2px);
}

.feature-icon {
    font-size: 1.75rem;
    color: var(--color-primary);
    margin-bottom: 0.75rem;
}

.closing-panel {
    border-top: 3px solid transparent;
    border-image: var(--gradient-brand) 1;
    padding-top: 1.5rem;
}

</style>

