<template>
    <div class="grid place-items-center">
        <h1 class="text-2xl mt-24">Login</h1>
        <el-form class="w-full max-w-sm mt-3" label-width="8rem" label-position="top">
            <el-form-item label="Email">
                <el-input v-model="email" placeholder="Enter your email"></el-input>
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

const email = ref('');
const password = ref('');

const handleLogin = () => {
    console.log('Login clicked', email.value, password.value);
};
</script>


<style scoped>

</style>
