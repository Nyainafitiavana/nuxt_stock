<script setup lang="ts">
  definePageMeta({
    layout: 'navbar',
    title: 'Product',
    middleware: ['user-middleware', 'admin-middleware']
  });
</script>

<template>
  <Title>Product</Title>
  <h1>Product</h1>
</template>

<style scoped>

</style>