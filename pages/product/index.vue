<script setup lang="ts">
  definePageMeta({
    layout: 'navbar',
    title: 'Product',
    middleware: ['user-middleware', 'admin-middleware']
  });

  const activeKey = ref('1');
</script>

<template>
  <Title>Product</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>Product</span>
  </ATypographyTitle>
  <a-tabs v-model:activeKey="activeKey" centered>
    <a-tab-pane key="1" @click="() => activeKey = '1'">
      <template #tab>
        <span>
          <check-circle-filled />
          Active
        </span>
      </template>
      <Suspense>
        <template #default>
          <ProductComponent v-if="activeKey === '1'"  :active-page="'ACT'"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <a-tab-pane key="2" @click="() => activeKey = '2'">
      <template #tab>
        <span>
          <delete-outlined/>
          Deleted
        </span>
      </template>
      <Suspense>
        <template #default>
          <ProductComponent v-if="activeKey === '2'" :active-page="'DLT'"/>
        </template>
      </Suspense>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>