<script setup lang="ts">
  import NewPurchaseComponent from "~/components/Inventory/NewPurchaseComponent.vue";

  definePageMeta({
    layout: 'navbar',
    title: 'Purchase_new',
    middleware: ['user-middleware']
  });

  //This is a global state for language of the app
  const language = useLanguage();
</script>

<template>
  <Title>{{ translations[language].newPurchase }}</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>{{ translations[language].newPurchase }}</span>
  </ATypographyTitle>
  <Suspense>
    <NewPurchaseComponent />
  </Suspense>
</template>

<style scoped>

</style>