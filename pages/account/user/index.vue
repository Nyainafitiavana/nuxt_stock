<script setup lang="ts">
  definePageMeta({
    layout: 'navbar',
    title: 'Users',
    middleware: ['user-middleware', 'admin-middleware']
  });
</script>

<template>
  <h2>User</h2>
</template>

<style scoped>

</style>