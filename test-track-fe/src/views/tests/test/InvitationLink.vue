<template>

    <p
        class="mt-6 mb-6"
    >
        Invitation link for test-takers:
        <br>
        <a
            :href="testLink"
            class="text-primary hover:underline"
        >
            {{ testLink }}
        </a>
        <br>
        Simply copy this link and send it to your test-takers. This link is not editable.

    </p>

</template>

<script
    setup
    lang="ts"
>
import { computed } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

/**
 * Computed property for displaying the invitation link for test-takers.
 */
const testLink = computed(() => {

    const testCode = testEditorStore.test?.test_code;
    const baseUrl = window.location.origin;

    return testCode ? `${baseUrl}/tests/take-test/${testCode}` : '';

});


</script>

<style scoped></style>
