<script setup lang="ts">
  import NewSalesComponent from "~/components/Inventory/NewSalesComponent.vue";

  definePageMeta({
    layout: 'navbar',
    title: 'Sales_new',
    middleware: ['user-middleware']
  });
</script>

<template>
  <Title>New sales</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>New sales</span>
  </ATypographyTitle>
  <Suspense>
    <NewSalesComponent />
  </Suspense>
</template>

<style scoped>

</style>