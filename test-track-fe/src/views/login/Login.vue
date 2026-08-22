<template>
    <div class="grid place-items-center">

        <div class="auth-card mt-24">
            <div class="auth-card-accent"></div>

            <h1 class="text-2xl flex items-center gap-2">
                <el-icon><Lock /></el-icon>
                Login
            </h1>

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
                    show-password
                />

            </el-form-item>

            <!-- LOGIN BUTTON -->
            <el-form-item>

                <el-button
                    id="login-button"
                    @click="handleLogin"
                    :disabled="authStore.loading"
                    class="ml-auto"
                    type="primary"
                >Login</el-button>

            </el-form-item>
        </el-form>

        <!-- DON'T HAVE AN ACCOUNT? -->
        <div>
            <p class="text-sm text-gray-500">
                Don't have an account?
                <router-link
                    id="register-link"
                    :to="{ name: 'register', query: { redirect: route.query.redirect } }"
                    class="text-blue-500 hover:underline"
                >
                    Register here
                </router-link>
            </p>
        </div>

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
import { emailRules } from '@/validationRules/loginRegisterRules';
import { passwordRules } from '@/validationRules/loginRegisterRules';
import { useApiErrors } from '@/composables/useApiErrors';
import { Lock } from '@element-plus/icons-vue';

const router = useRouter()
const route = useRoute();

const authStore = useAuthStore()
const formRef = ref()

const {
    validationErrors,
    generalError,
    handleBackendErrors
} = useApiErrors()

const data = reactive({
    email: '',
    password: ''
});

const rules = {
    email: emailRules,
    password: passwordRules
};

const handleLogin = async () => {
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
        await authStore.signIn({
            email: data.email,
            password: data.password
        })

        const url = createUrl();

        router.push(url);
    } catch (error) {
        handleBackendErrors(error)
    }
}
/**
 * This is essential for cases when a test taker tries to access through received link his test,
 * that he must take. The link looks like this:
 * Example: /tests/take-test/TEST-4039-ms
 * If he clicks on the link, first he will be redirected to the login page. But, thanks to our setup
 * in routes.ts now the login page link will look like this:
 * /login?redirect=/tests/take-test/TEST-4039-ms        <- notice the redirect query parameter
 *
 * Now the app needs to decide, it this is a regular login, when the user must be redirected to the
 * '/' page, or this is the case when a test take wants to visit his test, so after successfull
 * login.
 */
const createUrl = () => {

    // Extract the redirect query parameter from the url
    const redirectUrl = route.query.redirect;

    // Check if redirect url is a string (important for TS). Is so, redirect user to testing url
    if (typeof redirectUrl === 'string') {

        return redirectUrl;
    }

    // This is regular login, when user should be redirected to the home page
    return '/';
}

</script>

<style scoped>

</style>
