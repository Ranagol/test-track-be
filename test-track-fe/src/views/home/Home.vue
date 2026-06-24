<template>
    <h1>Home</h1>
    <h1 class="text-3xl font-bold underline">
        Welcome to Test Track!
    </h1>

    <el-form
        class="mt-3"
        label-position="top"
        style="width: 33%"
    >
        <el-form-item
            label="Please type in your test code to start the test"
        >
            <el-input
                placeholder="Test code"
                v-model="data.testCode"
            />
        </el-form-item>

    </el-form>

</template>

<script setup lang="ts">
import { reactive } from 'vue';


let data = reactive({
    testCode: '',
});



</script>

<style scoped></style>
