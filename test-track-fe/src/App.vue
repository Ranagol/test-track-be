<template>
    <Navbar/>
    <RouterView></RouterView>
</template>

<script
    setup
    lang="ts"
>
import Navbar from '@/views/navbar/Navbar.vue';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/useAuthStore';
import { getCsrfCookie } from '@/services/authService';

let authStore = useAuthStore();

/**
 * We always want to have a fresh CSRF cookie. So whenever this app loads, we get a new CSRF cookie.
 * The currently logged in user is stored in Pinia store. Pinia store forgets the currently logged in
 * user of refresh. The user seems logged out after refresh on FE, but on BE the user is still logged
 * in. So, to solve this, we simply get the currently logged in user from BE on every refresh.
 * If at the very beginning there is no currently logged in user, then the user in Pinia will be null.
 */
onMounted(async () => {
    await getCsrfCookie();
    await authStore.getCurrentUser();
});


</script>
