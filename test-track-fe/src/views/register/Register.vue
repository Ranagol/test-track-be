<template>
    <div class="grid place-items-center">
        <h1 class="text-2xl mt-24">Register</h1>
        <el-form class="w-full max-w-sm mt-3" label-width="8rem" label-position="top">
            <el-form-item label="Name">
                <el-input v-model="name" placeholder="Enter your name"></el-input>
            </el-form-item>
            <el-form-item label="Email">
                <el-input v-model="email" type="email" placeholder="Enter your email"></el-input>
            </el-form-item>
            <el-form-item label="Password">
                <el-input v-model="password" type="password" placeholder="Enter your password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm password">
                <el-input v-model="confirm_password" type="password" placeholder="Confirm your password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="ml-auto" type="primary" @click="handleRegister">Register</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const confirm_password = ref('');

const handleRegister = () => {
    console.log('Register clicked', name.value, email.value, password.value, confirm_password.value);
};
</script>


<style scoped>

</style>
