<script setup lang="ts">
  import NewPurchaseComponent from "~/components/Inventory/NewPurchaseComponent.vue";

  definePageMeta({
    layout: 'navbar',
    title: 'Purchase_new',
    middleware: ['user-middleware']
  });
</script>

<template>
  <Title>New purchase</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>New purchase</span>
  </ATypographyTitle>
  <Suspense>
    <NewPurchaseComponent />
  </Suspense>
</template>

<style scoped>

</style>