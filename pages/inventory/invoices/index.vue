<script setup lang="ts">

import InvoicesComponent from "~/components/Inventory/InvoicesComponent.vue";

definePageMeta({
  layout: 'navbar',
  title: 'Invoices',
  middleware: ['user-middleware', 'admin-middleware']
});

//This is a global state for language of the app
const language = useLanguage();
</script>

<template>
  <Title>{{ language === 'ENG' ? 'Invoices' : 'Factures' }}</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <SnippetsOutlined />&nbsp;
    <span>{{ language === 'ENG' ? 'Invoices' : 'Factures' }}</span>
  </ATypographyTitle>
  <Suspense>
    <InvoicesComponent />
  </Suspense>
</template>

<style scoped>

</style>