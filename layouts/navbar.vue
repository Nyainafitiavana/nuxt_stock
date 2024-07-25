<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { RouteList } from '~/composables/Route';

const selectedKeys = ref<string[]>(['1']);
const collapsed = ref<boolean>(false);
const route = useRoute();

// Compute the width of the sider based on its collapsed state
const siderWidth = computed(() => (collapsed.value ? '80px' : '200px'));

// Adjust current menu with current route
switch (route.path) {
  case RouteList.DASHBOARD:
    selectedKeys.value = ['1'];
    break;
  case RouteList.PROFILE:
    selectedKeys.value = ['2'];
    break;
  case RouteList.USER:
    selectedKeys.value = ['3'];
    break;
  case RouteList.CATEGORY:
    selectedKeys.value = ['4'];
    break;
  case RouteList.PRODUCT:
    selectedKeys.value = ['5'];
    break;
  case RouteList.ORDER:
    selectedKeys.value = ['6'];
    break;
}

const userRole = ref<string | null>(null);
//Get userRole of userConnect on the localstorage
onMounted(() => {
  userRole.value = localStorage.getItem("role") ? localStorage.getItem("role") : null;
});
</script>

<template>
  <a-layout has-sider>
    <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        class="sider"
        :style="{ width: siderWidth, transition: 'width 0.2s' }"
    >
      <div class="logo flex justify-start mt-2" @click="() => navigateTo(RouteList.HOME)">
        <img src="/favicon.ico" alt="" class="ml-2">
        <h1 class="text-white pt-2 ml-2" v-if="!collapsed">Stock App</h1>
      </div>
      <a-menu :class="collapsed ? '' : 'mt-5'" v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" v-if="userRole != null && userRole == 'ADMIN'">
          <NuxtLink :to="RouteList.DASHBOARD">
            <BarChartOutlined style="font-size: 18px;" />
            <span>Dashboard</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="2">
          <NuxtLink :to="RouteList.PROFILE">
            <user-outlined style="font-size: 18px;" />
            <span>Profile</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="3" v-if="userRole != null && userRole == 'ADMIN'">
          <NuxtLink :to="RouteList.USER">
            <UsergroupAddOutlined style="font-size: 18px;"/>
            <span>Users</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="4" v-if="userRole != null && userRole == 'ADMIN'">
          <NuxtLink :to="RouteList.CATEGORY">
            <AppstoreOutlined style="font-size: 18px;" />
            <span>Category</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="5" v-if="userRole != null && userRole == 'ADMIN'">
          <NuxtLink :to="RouteList.PRODUCT">
            <ShopOutlined style="font-size: 18px;" />
            <span>Product</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="6">
          <NuxtLink :to="RouteList.ORDER">
            <ShoppingCartOutlined style="font-size: 18px;"/>
            <span>Order</span>
          </NuxtLink>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: siderWidth }">
      <a-layout-header style="background: #fff; padding: 0 15px;">
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            style="font-size: 20px;"
            @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
            v-else
            class="trigger"
            style="font-size: 20px;"
            @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
          :style="{ margin: '24px 16px 0', overflow: 'initial', padding: '24px', background: '#fff', minHeight: '800px' }"
      >
        <slot />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ny Aina Fitiavana FITAHIANTSOA ©2024
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
  .sider {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh; /* Full viewport height */
    background: #001529; /* Background color of the sider */
    z-index: 1; /* Ensure the sider is above other content */
    transition: width 0.2s; /* Smooth transition for width changes */
  }

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }
</style>
