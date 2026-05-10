<template>
    <div class="grid place-items-center">

        <h1 class="text-2xl mt-24">Login</h1>
        <h1>test-taker@gmail.com</h1>
        <h1>admin@gmail.com</h1>
        <h1>tester@gmail.com</h1>


        <el-form
            ref="formRef"
            :model="data"
            :rules="rules"
            class="w-full max-w-sm mt-3"
            label-position="top"
            label-width="8rem"
        >
            <!-- EMAIL -->
            <el-form-item
                prop="email"
                :error="backendErrors.email?.[0]"
                label="Email"
            >

                <el-input
                    v-model="data.email"
                    placeholder="Enter your email"
                />

            </el-form-item>

            <!-- PASSWORD -->
            <el-form-item
                prop="password"
                :error="backendErrors.password?.[0]"
                label="Password"
            >

                <el-input
                    v-model="data.password"
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
import { emailRules } from '@/validationRules/validationRules';
import { passwordRules } from '@/validationRules/validationRules';
import { useBackendErrorHandling } from '@/composables/useBackendErrorHandling';

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const {
    backendErrors,
    generalError,
    handleBackendErrors
} = useBackendErrorHandling()

const data = reactive({
    email: '',
    password: ''
});

const rules = {
    email: emailRules,
    password: passwordRules
};

const handleLogin = async () => {
    backendErrors.value = {}
    generalError.value = ''

    /**
     * Validates the form. Return true if valid, false if not. If not valid, it also shows the
     * validation errors on the form.
     * You can turn off FE validation for testing, by commenting out the next two lines.
     */
    const isValid = await formRef.value.validate()
    if (!isValid) return

    try {
        await authStore.signIn({
            email: data.email,
            password: data.password
        })

        router.push('/')
    } catch (error) {
        handleBackendErrors(error)
    }
}

</script>

<style scoped>

</style>
