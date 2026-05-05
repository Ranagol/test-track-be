<template>
    <div>


        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">Processing Center</el-menu-item>
            <el-menu-item index="2">Processing Center2</el-menu-item>
            <el-menu-item index="3">Info</el-menu-item>
            <el-menu-item index="4">Orders</el-menu-item>
        </el-menu>

        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>


        <h1>Test Track Frontend</h1>
        <p v-if="loading">Loading...</p>
        <p v-else-if="isAuthenticated">Welcome, {{ user?.name }}!</p>
        <p v-else>Please log in.</p>
        <button @click="quickLogin" v-if="!isAuthenticated">Quick Login</button>
        <button @click="signOut" v-if="isAuthenticated">Sign Out</button>

        <br>
        <RouterLink to="/users">Users</RouterLink>
        <RouterLink to="/tests">Tests</RouterLink>

        <RouterView></RouterView>

    </div>
</template>


<script
    setup
    lang="ts"
>
import { onMounted, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { user, isAuthenticated, loading, initAuth, signIn, signOut } = useAuth();




const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}







onMounted(async () => {
    await initAuth();
});

async function quickLogin() {
    await signIn({
        email: 'tester@gmail.com',
        password: 'tester@gmail.com',
    });
}

</script>
