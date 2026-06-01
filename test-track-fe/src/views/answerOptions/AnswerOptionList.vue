<template>
    <!-- ANSWER OPTIONS -->
    <div class="answer-options mt-3">

        <div
            v-for="answerOption in (question.answer_options || [])"
            :key="answerOption.id"
            class="answer-row"
        >
            <!-- RADIO (controlled manually, NOT el-radio wrapper) -->
            <input
                type="radio"
                :name="radioGroupName"
                :value="answerOption.id"
                v-model="selectedAnswerOption"
                @change="handleAnswerSelection(answerOption.id)"
                class="answer-radio"
            />

            <!-- CONTENT -->
            <AnswerOption
                :answerOption="answerOption"
                :mode="props.mode"
                :questionId="props.question.id"
            />
        </div>

    </div>

    <!-- ADD NEW OPTION -->
    <AddNewAnswerOption
        v-if="props.mode === 'create' && typeof props.question.id === 'string'"
        :questionId="props.question.id"
        class="mt-4"
    />
</template>

<script setup lang="ts">
import type { Question } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import AddNewAnswerOption from '@/views/answerOptions/AddNewAnswerOption.vue';
import { ref } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testAttemptStore = useTestAttemptStore();
const testEditorStore = useTestEditorStore();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';
}>();

const selectedAnswerOption = ref<number | string | null>(null);

/**
 * unique per question to avoid cross-question radio conflicts
 */
const radioGroupName = `question-${props.question.id}`;

const handleAnswerSelection = (answerOptionId: number | string) => {

    if (props.mode === 'take' && typeof props.question.id === 'number') {
        testAttemptStore.updateUserAnswers(
            props.question.id,
            answerOptionId
        );
    }

    if (props.mode === 'create' && typeof props.question.id === 'string') {
        testEditorStore.setAnswerOptionIsCorrectInStore(
            props.question.id,
            answerOptionId
        );
    }
};
</script>

<style scoped>
.answer-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.answer-row {
    display: flex;
    align-items: center; /* restore center alignment */
    gap: 12px;
}

.answer-radio {
    display: flex;
    align-items: center;
    justify-content: center;

    /* key fix: optical vertical correction */
    transform: translateY(2px);
}
</style>
