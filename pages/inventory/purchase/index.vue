<script setup lang="ts">
import SalesComponent from "~/components/Inventory/SalesComponent.vue";
import PurchaseComponent from "~/components/Inventory/PurchaseComponent.vue";

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
  <a-tabs v-model:activeKey="activeKey" centered>
    <!--Outstanding tab-->
    <a-tab-pane key="1" @click="() => activeKey = '1'">
      <template #tab>
        <span>
          <HistoryOutlined />
          In progress
        </span>
      </template>
      <Suspense>
        <template #default>
          <PurchaseComponent v-if="activeKey === '1'"  :active-page="STCodeList.IN_PROGRESS"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <!--Validated tab-->
    <a-tab-pane key="2" @click="() => activeKey = '2'">
      <template #tab>
        <span>
          <check-circle-filled />
          Validated
        </span>
      </template>
      <Suspense>
        <template #default>
          <PurchaseComponent v-if="activeKey === '2'"  :active-page="STCodeList.VALIDATED"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <!--Rejected tab-->
    <a-tab-pane key="3" @click="() => activeKey = '3'">
      <template #tab>
        <span>
          <StopOutlined/>
          Rejected
        </span>
      </template>
      <Suspense>
        <template #default>
          <PurchaseComponent v-if="activeKey === '3'" :active-page="STCodeList.REJECTED"/>
        </template>
      </Suspense>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>