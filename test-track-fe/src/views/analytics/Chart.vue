<template>
    <apexchart
        :options="data.options"
        :series="data.series"
        type="bar"
        width="500"
    ></apexchart>
</template>

<script
    setup
    lang="ts"
>
import type { TestAttempt } from '@/types/types';
import { reactive, watch } from 'vue';

const props = defineProps<{
    testAttempts: TestAttempt[];
}>();

const data = reactive({
    options: {
        chart: {
            id: 'vuechart-example'
        },
        xaxis: {
            // Categories on the X axis
            categories: [] as (string | number)[]
        },
        yaxis: {
            labels: {
                formatter: (value: number) => `${value}%`
            },
        },
        tooltip: {
            y: {
                // Format Y axis values as percentages in the tooltip
                formatter: (value: number) => `${value}%`
            }
        },

    },

    series: [{
        name: 'Score percentage',
        // Values (how high will be the bar) on Y axis
        data: [] as number[]
    }]
})

/**
 * This watcher transforms the relevant TestAttempt data into the format that ApexCharts can understand
 * and reactively updates the chart whenever the testAttempts prop changes.
 */
watch(
    () => props.testAttempts,
    (testAttempts) => {
        data.options.xaxis.categories = testAttempts.map((attempt, index) => `Attempt ${index + 1} (${attempt.created_at ?? 0})`);
        data.series[0]!.data = testAttempts.map(attempt => attempt.score_percentage ?? 0);
    },
    {
        deep: true,
        immediate: true
    },
);






</script>
