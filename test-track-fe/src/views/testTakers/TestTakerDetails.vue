<template>

    <!--This is the component/view for this http://localhost:5174/analytics/5 -->

    <div>
        <Heading1
            text="Test taker details (Analytics)"
            class="mt-6"
        />

        <div v-loading="testTakerStore.loading" class="mt-6">

            <!-- USER DATA -->
            <div class="mt-6">
                <h5>Test taker details</h5>
                <p>Name: {{ testTakerStore.testTaker?.name }}</p>
                <p>Email: {{ testTakerStore.testTaker?.email }}</p>
            </div>

            <!-- TESTS -->
            <TestTakerPerformance
                v-for="test in testTakerStore.testTakerPerformance"
                :key="test.id"
                :test="test"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestTakerStore } from '@/stores/useTestTakerStore';
import Heading1 from '@/resusableComponents/Heading1.vue';
import TestTakerPerformance from '@/views/analytics/TestTakerPerformance.vue';
import { useApiErrors } from '@/composables/useApiErrors';

const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const route = useRoute();
const router = useRouter();
const testTakerId = route.params.testTakerId as string;

const testTakerStore = useTestTakerStore();

onMounted(async () => {
    try {

        if (!testTakerId) {
            throw new Error('No test taker ID provided in route params');
        }

        // Fetch the test taker.
        await testTakerStore.get(Number(testTakerId));

        // Fetch all relevant tests for analytics, from the given test taker ID
        await testTakerStore.getPerformance(Number(testTakerId));

    } catch (error) {
        handleBackendErrors(error);
    }
});
</script>

<style scoped>

</style>
