<template>
    <h2>Answer structure</h2>

    <el-table
        :data="data.rows"
        row-key="questionId"
        :cell-style="cellStyle"
        style="max-width: 80%"
        class="mb-6"
    >
        <!-- Row index column -->
        <el-table-column
            type="index"
            label="#"
            width="60"
        />

        <!-- Question text column -->
        <el-table-column
            prop="questionText"
            label="Question"
        />

        <!-- Correct answer column -->
        <el-table-column
            prop="correctAnswer"
            label="Correct Answer"
        />

        <!-- Dynamic attempt columns -->
        <el-table-column
            v-for="col in data.attemptColumns"
            :key="col.key"
            :prop="col.key"
            :label="col.label"
        >
            <template #default="{ row }">
                <!--
                    We safely access the nested attempt answer.
                    Fallback "-" if missing.
                -->
                {{ row.attempts[col.key] ?? '-' }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { Test, TestAttempt, QuestionType, UserAnswer } from '@/types/types';
import { reactive, watch } from 'vue';

/**
 * Props: full test object with questions + attempts
 */
const props = defineProps<{
    test: Test
}>();

/**
 * Type for dynamic attempt columns
 */
type AttemptColumn = {
    key: string;   // must be string for safe object lookup
    label: string;
};

/**
 * Reactive table state
 * - rows: transformed question-based rows
 * - attemptColumns: dynamic columns per attempt
 */
const data = reactive<{
    rows: Array<{
        rowNumber: number;
        questionId: number;
        questionText: string;
        correctAnswer: string | null;
        attempts: Record<string, string>
    }>;
    attemptColumns: AttemptColumn[];
}>({
    rows: [],
    attemptColumns: []
});

/**
 * Core transformation function:
 * Converts deeply nested backend structure into flat table structure.
 */
function transformTestData(test: Test) {
    const attempts = test.attempts ?? [];
    const questions = test.questions ?? [];

    /**
     * 1. Build dynamic columns from attempts
     * Each attempt becomes a table column
     */
    const attemptColumns: AttemptColumn[] = attempts.map((a: TestAttempt) => ({
        key: String(a.id), // IMPORTANT: normalize to string
        label: `Attempt on ${a.created_at}`
    }));

    /**
     * 2. Build lookup map:
     * attemptId -> questionId -> selected answer text
     *
     * Example:
     * {
     *   "19": { 28: "4", 29: "10" },
     *   "20": { 28: "4", 29: "15" }
     * }
     */
    const attemptMap: Record<string, Record<number, string>> = {};

    for (const attempt of attempts) {
        const attemptId = String(attempt.id);

        attemptMap[attemptId] = {};

        const userAnswers = attempt.userAnswers ?? [];
        for (const answer of userAnswers) {
            const answerText = (answer as any).selected_answer_option?.text ?? '';
            attemptMap[attemptId][answer.question_id] = answerText;
        }
    }

    /**
     * 3. Build rows (one row per question)
     * Each row contains:
     * - question text
     * - correct answer
     * - dynamic attempt answers
     */
    const rows = questions.map((q: QuestionType, index: number) => {
        const row: { rowNumber: number; questionId: number; questionText: string; correctAnswer: string | null; attempts: Record<string, string> } = {
            rowNumber: index + 1,
            questionId: q.id, // important for row-key
            questionText: q.text,
            correctAnswer: (q as any).correct_answer_text ?? null,

            /**
             * attempts object structure:
             * {
             *   "19": "4",
             *   "20": "10"
             * }
             */
            attempts: {}
        };

        // Fill each attempt column for this question
        for (const attempt of attempts) {
            const attemptId = String(attempt.id);

            row.attempts[attemptId] =
                attemptMap[attemptId]?.[q.id] ?? '-';
        }

        return row;
    });

    /**
     * 4. Assign transformed data to reactive state
     */
    data.rows = rows;
    data.attemptColumns = attemptColumns;
}

function cellStyle({ row, column }: any) {
    const key = column?.property;

    // Only dynamic attempt columns
    if (!key || key === 'questionText' || key === 'correctAnswer') {
        return {};
    }

    const value = row.attempts?.[key];

    if (!value || value === '-') {
        return {
            background: '#f5f5f5'
        };
    }

    const isCorrect =
        String(value).trim() === String(row.correctAnswer).trim();

    return {
        background: isCorrect ? '#d1fae5' : '#fee2e2',
        color: '#111'
    };
}

/**
 * Watch for changes in test prop
 * and re-transform table data
 */
watch(
    () => props.test,
    (test) => {
        if (test) {
            transformTestData(test);
        }
    },
    {
        immediate: true, // run on component mount
        deep: true       // react to nested changes
    }
);
</script>
