<script setup lang="ts">

definePageMeta({
  layout: 'navbar',
  title: 'Purchase',
  middleware: ['user-middleware']
});

const activeKey = ref('1');
</script>

<template>
  <Title>Purchase</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>Purchase</span>
  </ATypographyTitle>
</template>

<style scoped>

</style>