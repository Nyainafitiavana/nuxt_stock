<script setup lang="ts">
import {ref, computed, onMounted, reactive, h, watch} from 'vue';
import { useRoute } from 'vue-router';
import { RouteList } from '~/composables/Route';
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ShopOutlined, ShoppingCartOutlined,
  TeamOutlined, ToTopOutlined,
  UserOutlined, VerticalAlignBottomOutlined, VerticalAlignMiddleOutlined
} from "#components";

// State
const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['inventory'],
  preOpenKeys: ['inventory'],
});

// Admin and User ID refs
const isAdmin = ref<string | null>(null);
const userId = ref<string | null>(null);


const adminMenuItems = reactive([
  {
    key: '1',
    icon: () => h(BarChartOutlined),
    label: 'Dashboard',
    title: 'Dashboard',
    onClick: () => navigateTo(RouteList.DASHBOARD),
  },
  {
    key: '2',
    icon: () => h(UserOutlined),
    label: 'Profile',
    title: 'Profile',
    onClick: () => navigateTo(RouteList.PROFILE + '/' + userId.value),
  },
  {
    key: '3',
    icon: () => h(TeamOutlined),
    label: 'User',
    title: 'User',
    onClick: () => navigateTo(RouteList.USER),
  },
  {
    key: '4',
    icon: () => h(AppstoreOutlined),
    label: 'Category',
    title: 'Category',
    onClick: () => navigateTo(RouteList.CATEGORY),
  },
  {
    key: '5',
    icon: () => h(AppstoreAddOutlined),
    label: 'Unit',
    title: 'Unit',
    onClick: () => navigateTo(RouteList.UNIT),
  },
  {
    key: '6',
    icon: () => h(ShopOutlined),
    label: 'Product',
    title: 'Product',
    onClick: () => navigateTo(RouteList.PRODUCT),
  },
  {
    key: 'inventory',
    icon: () => h(ShoppingCartOutlined),
    label: 'Inventory',
    title: 'Inventory',
    children: [
      {
        key: '8',
        icon: () => h(VerticalAlignBottomOutlined),
        label: 'Purchase',
        title: 'Purchase',
        onClick: () => navigateTo(RouteList.INVENTORY_PURCHASE),
      },
      {
        key: '9',
        icon: () => h(ToTopOutlined),
        label: 'Sales',
        title: 'Sales',
        onClick: () => navigateTo(RouteList.INVENTORY_SALES),
      },
      {
        key: '10',
        icon: () => h(VerticalAlignMiddleOutlined),
        label: 'Stock situation',
        title: 'Stock situation',
        onClick: () => navigateTo(RouteList.STOCK_SITUATION),
      },
    ],
  },
]);

// Menu items
const managerMenuItems = reactive([
  {
    key: '2',
    icon: () => h(UserOutlined),
    label: 'Profile',
    title: 'Profile',
    onClick: () => navigateTo(RouteList.PROFILE + '/' + userId.value),
  },
  {
    key: 'inventory',
    icon: () => h(ShoppingCartOutlined),
    label: 'Inventory',
    title: 'Inventory',
    children: [
      {
        key: '8',
        icon: () => h(VerticalAlignBottomOutlined),
        label: 'Purchase',
        title: 'Purchase',
        onClick: () => navigateTo(RouteList.INVENTORY_PURCHASE),
      },
      {
        key: '9',
        icon: () => h(ToTopOutlined),
        label: 'Sales',
        title: 'Sales',
        onClick: () => navigateTo(RouteList.INVENTORY_SALES),
      },
    ],
  },
]);

// Route and Router
const route = useRoute();

// Computed width of the side based on collapsed state
const sideWidth = computed(() => (state.collapsed ? '80px' : '200px'));

// Update selected menu keys based on the current route
const updateSelectedKeys = () => {
  switch (route.path) {
    case RouteList.DASHBOARD:
      state.selectedKeys = ['1'];
      break;
    case RouteList.PROFILE:
      state.selectedKeys = ['2'];
      break;
    case RouteList.USER:
      state.selectedKeys = ['3'];
      break;
    case RouteList.CATEGORY:
      state.selectedKeys = ['4'];
      break;
    case RouteList.UNIT:
      state.selectedKeys = ['5'];
      break;
    case RouteList.PRODUCT:
      state.selectedKeys = ['6'];
      break;
    case RouteList.INVENTORY_PURCHASE:
      state.selectedKeys = ['8'];
      break;
    case RouteList.INVENTORY_PURCHASE_NEW:
      state.selectedKeys = ['8'];
      break;
    case RouteList.INVENTORY_SALES:
      state.selectedKeys = ['9'];
      break;
      case RouteList.INVENTORY_SALES_NEW:
      state.selectedKeys = ['9'];
      break;
      case RouteList.STOCK_SITUATION:
      state.selectedKeys = ['10'];
      break;
    default:
      state.selectedKeys = ['2'];
      break;
  }
};

// On component mount, update selected keys and retrieve user data
onMounted(() => {
  isAdmin.value = localStorage.getItem("is_admin");
  userId.value = localStorage.getItem("userId");
  updateSelectedKeys();
});

// Watch for changes in open keys and update previous open keys
watch(
    () => state.openKeys,
    (_val, oldVal) => {
      state.preOpenKeys = oldVal;
    },
);

// Toggle sidebar collapsed state
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>

<template>
  <a-layout>
    <!-- Force re-render on collapse :key="state.collapsed ? 'collapsed' : 'expanded'"-->
    <a-layout-sider
      :key="state.collapsed ? 'collapsed' : 'expanded'"
      v-model:collapsed="state.collapsed"
      :trigger="null"
      collapsible
      class="side"
      :style="{ width: sideWidth, transition: 'width 0.2s' }"
    >

    <div class="logo flex justify-start mt-2">
      <img src="/favicon.ico" alt="" class="ml-2">
      <h1 class="text-white pt-2 ml-2" v-if="!state.collapsed">Stock App</h1>
    </div>
    <a-menu
        v-if="isAdmin !== null"
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="state.collapsed"
        :items="isAdmin === 'true' ? adminMenuItems : managerMenuItems"
    ></a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: sideWidth }">
      <a-layout-header style="background: #fff; padding: 0 15px;">
        <menu-unfold-outlined
            v-if="state.collapsed"
            class="trigger"
            style="font-size: 20px;"
            @click="toggleCollapsed"
        />
        <menu-fold-outlined
            v-else
            class="trigger"
            style="font-size: 20px;"
            @click="toggleCollapsed"
        />
      </a-layout-header>
      <a-layout-content
          :style="{ margin: '24px 16px 0', overflow: 'initial', padding: '24px', background: '#fff', minHeight: '800px' }"
      >
        <Suspense>
          <template #default>
            <slot />
          </template>
        </Suspense>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ny Aina Fitiavana FITAHIANTSOA ©2024
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.side {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* Full viewport height */
  background: #001529; /* Background color of the side */
  z-index: 1; /* Ensure the side is above other content */
  transition: width 0.2s; /* Smooth transition for width changes */
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
