<template>

    <Heading1 :text="props.test?.title || 'Test details'" />

    <Chart
        :testAttempts="props.test.attempts ?? []"
    />

    <Table
        :test="props.test"
    />



    <small>
        <pre>
            {{ props.test }}
        </pre>
    </small>

</template>

<script
    setup
    lang="ts"
>
import type { Test } from '@/types/types';
import Heading1 from '@/resusableComponents/Heading1.vue';
import Chart from '@/views/analytics/Chart.vue';
import Table from '@/views/analytics/Table.vue';

const props = defineProps<{
    test: Test;
}>();

</script>

<style scoped></style>
