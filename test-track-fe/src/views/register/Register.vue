<template>
    <div class="grid place-items-center">

        <h1 class="text-2xl mt-24">Register</h1>

        <el-form
            ref="formRef"
            :model="data"
            :rules="rules"
            class="w-full max-w-sm mt-3"
            label-position="top"
            label-width="8rem"
        >
            <!-- NAME -->
            <el-form-item
                prop="name"
                :error="validationErrors.name?.[0]"
                label="Name"
            >

                <el-input
                    v-model="data.name"
                    placeholder="Enter your name"
                />

            </el-form-item>

            <!-- EMAIL -->
            <el-form-item
                prop="email"
                :error="validationErrors.email?.[0]"
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
                :error="validationErrors.password?.[0]"
                label="Password"
            >

                <el-input
                    v-model="data.password"
                    placeholder="Enter your password"
                    type="password"
                />

            </el-form-item>

            <!-- CONFIRM PASSWORD -->
            <el-form-item
                prop="password_confirmation"
                :error="validationErrors.password_confirmation?.[0]"
                label="Confirm Password"
            >

                <el-input
                    v-model="data.password_confirmation"
                    placeholder="Confirm your password"
                    type="password"
                />

            </el-form-item>

            <!-- REGISTER BUTTON -->
            <el-form-item>

                <el-button
                    @click="handleRegister"
                    :disabled="authStore.loading"
                    class="ml-auto"
                    type="primary"
                >Register</el-button>

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
import { nameRules } from '@/validationRules/validationRules';
import { emailRules } from '@/validationRules/validationRules';
import { passwordRules } from '@/validationRules/validationRules';
import { createPasswordConfirmationRules } from '@/validationRules/validationRules';
import { useApiErrors } from '@/composables/useApiErrors';

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const {
    validationErrors,
    generalError,
    handleBackendErrors
} = useApiErrors()

const data = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const rules = {
    name: nameRules,
    email: emailRules,
    password: passwordRules,
    // We send the whole data object, becaues this must be reactive. Sending only the password will make this non-reactive, and the validation won't work.
    password_confirmation: createPasswordConfirmationRules(data)
};

const handleRegister = async () => {
    validationErrors.value = {}
    generalError.value = ''

    /**
     * Validates the form. Return true if valid, false if not. If not valid, it also shows the
     * validation errors on the form.
     * You can turn off FE validation for testing, by commenting out the next two lines.
     */
    const isValid = await formRef.value.validate()
    if (!isValid) return

    try {
        await authStore.register({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation
        })

        router.push('/')
    } catch (error) {
        handleBackendErrors(error)
    }
}



</script>


<style scoped>

</style>
