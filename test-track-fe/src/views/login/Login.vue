<template>
    <div class="grid place-items-center">
        <h1 class="text-2xl mt-24">Login</h1>
        <el-form class="w-full max-w-sm mt-3">
            <el-form-item label="Username">
                <el-input v-model="username" placeholder="Enter your username"></el-input>
            </el-form-item>
            <el-form-item label="Password">
                <el-input v-model="password" type="password" placeholder="Enter your password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="ml-auto" type="primary" @click="handleLogin">Login</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

const handleLogin = () => {
    console.log('Login clicked', username.value, password.value);
};
</script>


<style scoped>

</style>
