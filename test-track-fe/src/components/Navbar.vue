<template>
    <!-- //TODO ANDOR how to make these colors dynamic, connect with main.css variables -->
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        router
        
    >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/tests">Tests</el-menu-item>
        <el-menu-item index="/users">Users</el-menu-item>
        <el-menu-item index="/login">Login</el-menu-item>
        <el-menu-item index="/register">Register</el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';


</script>

<style scoped>

/* Set the height of the horizontal navigation menu */
.el-menu--horizontal {
  --el-menu-horizontal-height: 1.9rem;
}
</style>
