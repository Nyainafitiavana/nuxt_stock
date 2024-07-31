<script setup lang="ts">
  definePageMeta({
    layout: 'navbar',
    title: 'Product',
    middleware: ['user-middleware', 'admin-middleware']
  });
</script>

<template>
  <h1>Product</h1>
</template>

<style scoped>

</style>