<template>

    <h1 class="text-3xl font-bold mt-5">
        Welcome to Test Track home page!
    </h1>

    <div
        class="mt-5"
    >
        You can create a new test
        <router-link
            :to="{ name: 'test-create' }"
        >
            <span class="text-blue-500 hover:text-blue-700">here.</span>
        </router-link>

    </div>

    <div>
        Or, you can learn about TestTrack
        <router-link
            :to="{ name: 'about' }"
        >
            <span class="text-blue-500 hover:text-blue-700">here.</span>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import type router from '@/router/router';


</script>

<style scoped></style>
