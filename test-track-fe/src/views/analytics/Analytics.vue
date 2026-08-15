<template>
    <div>
        <Heading1
            text="Analytics"
            class="mt-6"
        />

        <div v-loading="testsStore.loading" class="mt-6">

            <!-- USER DATA -->
            <div class="mt-6">
                <h5>Test taker details</h5>
                <p>Name: {{ testTaker?.name }}</p>
                <p>Email: {{ testTaker?.email }}</p>
            </div>

            <!-- TESTS -->
            <Test
                v-for="test in testsStore.tests"
                :key="test.id"
                :test="test"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestsStore } from '@/stores/useTestsStore';
import Heading1 from '@/resusableComponents/Heading1.vue';
import userService from '@/services/userService';
import type { User } from '@/types/types';
import Test from '@/views/analytics/Test.vue';

const route = useRoute();
const router = useRouter();
const testTakerId = route.params.userId as string;
const testTaker = ref<User | null>(null);
const testsStore = useTestsStore();

onMounted(async () => {
    try {
        if (!testTakerId) {
            throw new Error('No test taker ID provided in route params');
        }

        // Fetch test taker
        testTaker.value = await userService.getTestTaker(Number(testTakerId));

        // Fetch all relevant tests for analytics
        await testsStore.getAnalytics(Number(testTakerId));
    } catch (error) {
        await router.push({ name: 'not-found' });
    }
});
</script>

<style scoped>

</style>
