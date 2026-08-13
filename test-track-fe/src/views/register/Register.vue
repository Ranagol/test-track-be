<template>
    <div class="grid place-items-center">

        <div class="auth-card mt-24">
            <div class="auth-card-accent"></div>

            <h1 class="text-2xl flex items-center gap-2">
                <el-icon><UserFilled /></el-icon>
                Register
            </h1>

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
                    id="name-input"
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
                    id="email-input"
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
                    id="password-input"
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
                    id="password-confirmation-input"
                    v-model="data.password_confirmation"
                    placeholder="Confirm your password"
                    type="password"
                />

            </el-form-item>

            <!-- REGISTER BUTTON -->
            <el-form-item>

                <el-button
                    id="register-button"
                    @click="handleRegister"
                    :disabled="authStore.loading"
                    class="ml-auto"
                    type="primary"
                >Register</el-button>

            </el-form-item>
        </el-form>

        <!-- ALREADY HAVE AN ACCOUNT? -->
        <p class="text-sm text-gray-500 mt-4">
            Already have an account?
            <router-link
                :to="{ name: 'login', query: { redirect: route.query.redirect } }"
                class="text-blue-500 hover:underline"
            >
                Login here
            </router-link>
        </p>

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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, useRoute } from 'vue-router';
import { nameRules } from '@/validationRules/loginRegisterRules';
import { emailRules } from '@/validationRules/loginRegisterRules';
import { passwordRules } from '@/validationRules/loginRegisterRules';
import { createPasswordConfirmationRules } from '@/validationRules/loginRegisterRules';
import { UserFilled } from '@element-plus/icons-vue';
import { useApiErrors } from '@/composables/useApiErrors';

const router = useRouter()
const route = useRoute()
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

        /**
         * We must the url create dynamically. It can't be just '/', by default. The '/' is
         * one possible option. The other option is when the user has a test link that he has to
         * visit. The the process is:
         * User has a test link (but has no account):
         * Example: /tests/take-test/TEST-4039-ms.
         * User clicks on the test link, and automatically is redirected (with his test link too in
         * the url, as an additional parameter) to the login page. But, he can't log in, because he
         * does not have an account. Exactly for this, there is the 'Don't have an account?' link.
         * The user click on this link, and he is now redirected to the /register page (this component),
         * again, together with his desired target url as a route parameter.
         * Now the user registers. If the registering is successfull, he will be then redirected to
         * his desired target url, the test, that he must solve.
         */
        const url = createUrl()
        router.push(url)
    } catch (error) {
        handleBackendErrors(error)
    }
}

/**
 * Redirect user to their originally requested page after successful registration,
 * or to home page if they registered without a specific redirect target.
 * This handles the case where a test taker clicks a test link but must register first.
 */
const createUrl = () => {
    const redirectUrl = route.query.redirect

    if (typeof redirectUrl === 'string') {
        return redirectUrl
    }

    return '/'
}



</script>


<style scoped>

</style>
