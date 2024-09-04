<script setup lang="ts">
  import NewSalesComponent from "~/components/Inventory/NewSalesComponent.vue";

  definePageMeta({
    layout: 'navbar',
    title: 'Sales_new',
    middleware: ['user-middleware']
  });

  //This is a global state for language of the app
  const language = useLanguage();
</script>

<template>
  <Title>{{ translations[language].newSales }}</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>{{ translations[language].newSales }}</span>
  </ATypographyTitle>
  <Suspense>
    <NewSalesComponent />
  </Suspense>
</template>

<style scoped>

</style>