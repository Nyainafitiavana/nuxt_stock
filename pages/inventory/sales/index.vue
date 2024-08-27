<script setup lang="ts">

definePageMeta({
  layout: 'navbar',
  title: 'Sales',
  middleware: ['user-middleware']
});

const activeKey = ref('1');
</script>

<template>
  <Title>Sales</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>Sales</span>
  </ATypographyTitle>
  <a-tabs v-model:activeKey="activeKey" centered>
    <a-tab-pane key="1" @click="() => activeKey = '1'">
      <template #tab>
        <span>
          <HistoryOutlined />
          Outstanding
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '1'"  :active-page="STCodeList.OUTSTANDING"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <a-tab-pane key="2" @click="() => activeKey = '2'">
      <template #tab>
        <span>
          <check-circle-filled />
          Completed
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '2'"  :active-page="STCodeList.COMPLETED"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <a-tab-pane key="3" @click="() => activeKey = '3'">
      <template #tab>
        <span>
          <StopOutlined/>
          Rejected
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '3'" :active-page="STCodeList.REJECTED"/>
        </template>
      </Suspense>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>