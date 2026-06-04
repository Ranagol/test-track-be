<template>
    <!-- VALIDATION ERROR MESSAGE FOR ALL ANSWER OPTION MISSING SELECTION -->
    <div
        v-if="props.showError"
        class="error-message"
    >

        <!-- "Exactly one answer option must be marked as correct." -->
        {{
            props.errorMessage ||
            'Exactly one answer option must be marked as correct FE source.'
        }}
    </div>

</template>

<script setup lang="ts">
/**
 * Displays AnswerOption validation error message. Specifically, if there is no Answer Option selected.
 * This displays the validation error message from BE.
 * Also works with the same validation error from FE logic. This FE logic is manually made, and it
 * is in the AnswerOptionList.vue component.
 */

const props = defineProps<{
    showError: boolean;
    errorMessage: string;
}>();



</script>

<style scoped>

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
}

</style>
