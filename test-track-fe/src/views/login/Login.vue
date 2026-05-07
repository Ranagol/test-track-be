<template>
    <div class="grid place-items-center">

        <h1 class="text-2xl mt-24">Login</h1>

        <el-form
            ref="formRef"
            :model="formModel"
            :rules="rules"
            class="w-full max-w-sm mt-3"
            label-position="top"
            label-width="8rem"
        >
            <!-- EMAIL -->
            <el-form-item
                :error="backendErrors.email?.[0]"
                label="Email"
            >

                <el-input
                    v-model="formModel.email"
                    placeholder="Enter your email"
                />

            </el-form-item>

            <!-- PASSWORD -->
            <el-form-item
                :error="backendErrors.password?.[0]"
                label="Password"
            >

                <el-input
                    v-model="formModel.password"
                    placeholder="Enter your password"
                    type="password"
                />

            </el-form-item>

            <!-- LOGIN BUTTON -->
            <el-form-item>

                <el-button
                    @click="handleLogin"
                    :disabled="authStore.loading"
                    class="ml-auto"
                    type="primary"
                >Login</el-button>

            </el-form-item>
        </el-form>

        <!-- GENERAL ERROR MESSAGE -->
        <el-alert
            v-if="generalError"
            :title="generalError"
            type="error"
            class="w-full max-w-sm mt-4"
            :closable="true"
            @close="generalError = ''"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const formModel = reactive({
    email: '',
    password: ''
});
const rules = {
    email: [
        { required: true, message: 'Email is required', trigger: 'blur' },
        { type: 'email', message: 'Invalid email format', trigger: 'blur' },
        { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Password is required', trigger: 'blur' },
        { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
    ]
};
// Stores error messages from backend
const backendErrors = ref<Record<string, string[]>>({});
const generalError = ref<string>('');

const handleLogin = async () => {
    backendErrors.value = {}
    generalError.value = ''

    const valid = await formRef.value.validate()

    if (!valid) return

    try {
        await authStore.signIn({
            email: formModel.email,
            password: formModel.password
        })

        router.push('/')
    } catch (error: any) {
        handleBackendErrors(error)
    }
}

const handleBackendErrors = (error: any) => {

    const status = error.response.status
    const data = error.response.data

    // Handle 401 Unauthorized (invalid credentials)
    if (status === 401) {
        backendErrors.value = {
            password: ['Invalid credentials'],
            email: ['Invalid credentials']
        }
        return
    }

    // Handle 422 Unprocessable Entity (validation errors from backend)
    if (status === 422) {
        backendErrors.value = data?.errors || {}
        return
    }

    // Handle other unexpected errors
    console.error('Unexpected error', error)
    generalError.value = 'An unexpected error occurred. Please try again later.'
}
</script>


<style scoped>

</style>
