<template>

    <Heading1
        :text="props.test?.title || 'Test details'"
        class="mt-12"
    />

    <Chart
        :testAttempts="props.test.attempts ?? []"
    />

    <Table
        :test="props.test"
    />

</template>

<script
    setup
    lang="ts"
>
import type { Test } from '@/types/types';
import Heading1 from '@/resusableComponents/Heading1.vue';
import Chart from '@/views/testTakers/testTakerDetails/Chart.vue';
import Table from '@/views/testTakers/testTakerDetails/Table.vue';

const props = defineProps<{
    test: Test;
}>();

</script>

<style scoped></style>
