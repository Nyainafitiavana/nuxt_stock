<script setup lang="ts">
  import {TeamOutlined} from "#components";

  definePageMeta({
    layout: 'navbar',
    title: 'Category',
    middleware: ['user-middleware', 'admin-middleware']
  });

  const activeKey = ref('1');
</script>

<template>
  <Title>Category</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>Category</span>
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
          <CategoryComponent v-if="activeKey === '1'"  :actif-page="'ACT'"/>
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
          <CategoryComponent v-if="activeKey === '2'" :actif-page="'DLT'"/>
        </template>
      </Suspense>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>