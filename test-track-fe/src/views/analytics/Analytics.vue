<template>
    <div>
        <Heading1
            text="Analytics"
        />
        <div>
            <h5>Test taker details</h5>
            <p>Name: {{ testTaker?.name }}</p>
            <p>Email: {{ testTaker?.email }}</p>
        </div>

    </div>

    <small>
        <pre>
            {{ testsStore.tests }}
        </pre>
    </small>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestsStore } from '@/stores/useTestsStore';
import Heading1 from '@/resusableComponents/Heading1.vue';
import userService from '@/services/userService';
import type { User } from '@/types/types';

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
        testTaker.value = await userService.getTestTaker(Number(testTakerId));
        await testsStore.getAnalytics(Number(testTakerId));
    } catch (error) {
        console.error(error);
        return;
    }
});
</script>



<style scoped>

</style>
