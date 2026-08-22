<template>

    <!-- Hero -->
    <div class="hero text-center mb-16 pt-12 pb-10">

        <div class="hero-motif" aria-hidden="true">
            <svg width="150" height="120" viewBox="0 0 150 120">
                <!-- Illustrated figure: teacher/evaluator with a clipboard -->
                <circle cx="40" cy="34" r="16" class="figure-fill" />
                <rect x="21" y="52" width="38" height="50" rx="12" class="figure-fill-soft" />
                <rect x="53" y="60" width="20" height="26" rx="2" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="2" />
                <line x1="58" y1="68" x2="68" y2="68" stroke="var(--color-primary)" stroke-width="2" />
                <line x1="58" y1="74" x2="68" y2="74" stroke="var(--color-primary)" stroke-width="2" />
                <line x1="58" y1="80" x2="65" y2="80" stroke="var(--color-primary)" stroke-width="2" />

                <!-- Progress line, same motif as before -->
                <polyline
                    points="85,100 100,80 113,90 145,55"
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <circle cx="85" cy="100" r="4" class="hero-motif-dot-soft" />
                <circle cx="100" cy="80" r="4" class="hero-motif-dot-soft" />
                <circle cx="113" cy="90" r="4" class="hero-motif-dot" />
                <circle cx="145" cy="55" r="5" class="hero-motif-dot-strong" />
            </svg>
        </div>

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
            v-for="(feature, index) in features"
            :key="feature.title"
            :to="feature.to"
            class="feature-card"
            :class="`feature-card-reveal delay-${index}`"
        >
            <div class="feature-icon-chip" :class="`chip-${feature.tone}`">
                <el-icon class="feature-icon"><component :is="feature.icon" /></el-icon>
            </div>

            <h3 class="text-xl font-semibold mb-3">
                {{ feature.title }}
            </h3>

            <p class="text-text-soft">
                {{ feature.description }}
            </p>
        </router-link>

    </div>


    <!-- Longitudinal tracking -->
    <div class="tracking-section mb-12">
        <div class="tracking-text">
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

        <div class="tracking-preview" aria-hidden="true">
            <div class="tracking-preview-labels">
                <span>Attempt 1</span>
                <span>Attempt 4</span>
            </div>
            <svg width="100%" height="70" viewBox="0 0 200 70">
                <polyline
                    points="10,55 65,45 130,30 190,10"
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <circle cx="10" cy="55" r="4" class="hero-motif-dot-soft" />
                <circle cx="65" cy="45" r="4" class="hero-motif-dot-soft" />
                <circle cx="130" cy="30" r="4" class="hero-motif-dot" />
                <circle cx="190" cy="10" r="5" class="hero-motif-dot-strong" />
            </svg>
            <p class="tracking-preview-score">62% &rarr; 89%</p>
        </div>
    </div>

    <!-- Closing -->
    <div class="closing-panel text-center mt-16 mb-5">
        <svg class="closing-illustration" width="150" height="56" viewBox="0 0 150 56" aria-hidden="true">
            <!-- Three simple figures: teacher, student, HR professional -->
            <circle cx="30" cy="16" r="10" class="figure-fill-soft" />
            <rect x="16" y="28" width="28" height="26" rx="10" class="figure-fill-softer" />

            <circle cx="75" cy="12" r="11" class="figure-fill" />
            <rect x="59" y="25" width="32" height="30" rx="11" class="figure-fill-soft" />

            <circle cx="120" cy="16" r="10" class="figure-fill-soft" />
            <rect x="106" y="28" width="28" height="26" rx="10" class="figure-fill-softer" />
        </svg>

        <p class="text-xl font-semibold">
            TestTrack helps professionals understand not only where someone is
            today, but how they are developing over time.
        </p>
    </div>

</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
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

// Centralizing feature data lets each card carry a "tone" for its icon chip
// color, and makes the v-for/reveal-animation wiring in the template trivial.
const features = [
    {
        title: 'Create online tests',
        description: 'Create structured assessments with questions, answers, and automatic evaluation rules.',
        icon: EditPen,
        to: '/tests/create',
        tone: 'violet',
    },
    {
        title: 'Invite your test takers',
        description: 'Easily invite test takers via shareable links.',
        icon: Share,
        to: '/tests/create',
        tone: 'blue',
    },
    {
        title: 'Automatic evaluation',
        description: 'TestTrack will automatically check answers, calculate scores, and provide immediate feedback when needed.',
        icon: MagicStick,
        to: '/tests/create',
        tone: 'amber',
    },
    {
        title: 'Track development over time',
        description: 'You can store previous test attempts, scores, and results to follow progress and identify improvement trends.',
        icon: TrendCharts,
        to: '/tests/create',
        tone: 'teal',
    },
];

// Adds .is-visible to each .feature-card-reveal element as it scrolls into
// view. Disconnects once all cards have revealed, so it doesn't keep
// running on scroll after the home page has settled.
let observer: IntersectionObserver | undefined;

onMounted(() => {
    const cards = document.querySelectorAll('.feature-card-reveal');

    observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach((card) => observer?.observe(card));
});

onBeforeUnmount(() => {
    observer?.disconnect();
});
</script>

<style scoped>

.hero {
    border-bottom: 1px solid var(--color-border-light);
    position: relative;
}

.hero-motif {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
    opacity: 0.9;
}

.hero-motif-dot-soft {
    fill: color-mix(in srgb, var(--color-primary) 45%, white);
}

.hero-motif-dot {
    fill: var(--color-primary);
}

.hero-motif-dot-strong {
    fill: color-mix(in srgb, var(--color-primary) 70%, black);
}

/* Shared fills for the illustrated figures in the hero and closing panel,
   derived from --color-primary so they stay on-brand without new tokens. */
.figure-fill {
    fill: var(--color-primary);
}

.figure-fill-soft {
    fill: color-mix(in srgb, var(--color-primary) 55%, white);
}

.figure-fill-softer {
    fill: color-mix(in srgb, var(--color-primary) 30%, white);
}

.closing-illustration {
    display: block;
    margin: 0 auto 1rem;
    opacity: 0.9;
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

.feature-icon-chip {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
}

.feature-icon {
    font-size: 1.25rem;
}

/* Each tone pairs a light chip background with a darker icon color, so
   the four features read as distinct categories instead of one repeated
   accent. Swap these for your own palette stops if you have named ones. */
.chip-violet {
    background: #EEEDFE;
}
.chip-violet .feature-icon {
    color: #3C3489;
}

.chip-blue {
    background: #E6F1FB;
}
.chip-blue .feature-icon {
    color: #0C447C;
}

.chip-amber {
    background: #FAEEDA;
}
.chip-amber .feature-icon {
    color: #854F0B;
}

.chip-teal {
    background: #E1F5EE;
}
.chip-teal .feature-icon {
    color: #0F6E56;
}

/* Scroll-reveal: cards fade/slide up as they enter the viewport, staggered
   slightly by index via the delay-N classes. Toggled by the
   IntersectionObserver directive/composable — see note below the file. */
.feature-card-reveal {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.feature-card-reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.delay-0.is-visible { transition-delay: 0ms; }
.delay-1.is-visible { transition-delay: 80ms; }
.delay-2.is-visible { transition-delay: 160ms; }
.delay-3.is-visible { transition-delay: 240ms; }

.tracking-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.tracking-text {
    flex: 1 1 320px;
}

.tracking-preview {
    flex: 0 1 260px;
    background: var(--color-surface-soft);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
}

.tracking-preview-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--color-text-soft);
    margin-bottom: 0.5rem;
}

.tracking-preview-score {
    font-size: 0.85rem;
    color: var(--color-text-soft);
    margin-top: 0.5rem;
    text-align: right;
}

.closing-panel {
    border-top: 3px solid transparent;
    border-image: var(--gradient-brand) 1;
    padding-top: 1.5rem;
}

</style>
