<script setup lang="ts">
  import SalesComponent from "~/components/Inventory/SalesComponent.vue";

  definePageMeta({
    layout: 'navbar',
    title: 'Sales',
    middleware: ['user-middleware']
  });

  //This is a global state for language of the app
  const language = useLanguage();
  const activeKey = ref('1');
</script>

<template>
  <Title>{{ translations[language].sales }}</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <AppstoreOutlined/>&nbsp;
    <span>{{ translations[language].sales }}</span>
  </ATypographyTitle>
  <a-tabs v-model:activeKey="activeKey" centered>
    <!--Outstanding tab-->
    <a-tab-pane key="1" @click="() => activeKey = '1'">
      <template #tab>
        <span>
          <HistoryOutlined />
          {{ translations[language].inProgress }}
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '1'"  :active-page="STCodeList.IN_PROGRESS"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <!--Validated tab-->
    <a-tab-pane key="2" @click="() => activeKey = '2'">
      <template #tab>
        <span>
          <check-circle-filled />
          {{ translations[language].validated }}
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '2'"  :active-page="STCodeList.VALIDATED"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <!--Rejected tab-->
    <a-tab-pane key="3" @click="() => activeKey = '3'">
      <template #tab>
        <span>
          <StopOutlined/>
          {{ translations[language].rejected }}
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '3'" :active-page="STCodeList.REJECTED"/>
        </template>
      </Suspense>
    </a-tab-pane>
    <!--Completed tab-->
    <a-tab-pane key="4" @click="() => activeKey = '4'">
      <template #tab>
        <span>
          <check-circle-filled />
          {{ translations[language].completed }}
        </span>
      </template>
      <Suspense>
        <template #default>
          <SalesComponent v-if="activeKey === '4'"  :active-page="STCodeList.COMPLETED"/>
        </template>
      </Suspense>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>