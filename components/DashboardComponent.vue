<script setup lang="ts">
import { translations } from "~/composables/translations";
import { ref, computed, onMounted } from "vue";

// This is a global state for language of the app
const language = useLanguage();

const isLoading = ref<boolean>(true);

// Data for the chart
const chartData = [
  {
    month: "Jan",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Feb",
    total_purchase_price: 202500,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 202500
  },
  {
    month: "Mar",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Apr",
    total_purchase_price: 430000,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 430000
  },
  {
    month: "May",
    total_purchase_price: 0,
    total_sales: 3200,
    total_expenses: 0,
    benefits: 3200,
    loss: 0
  },
  {
    month: "Jun",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Jul",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Aug",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Sep",
    total_purchase_price: 1006000,
    total_sales: 10033000,
    total_expenses: 759000,
    benefits: 8268000,
    loss: 0
  },
  {
    month: "Oct",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Nov",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  },
  {
    month: "Dec",
    total_purchase_price: 0,
    total_sales: 0,
    total_expenses: 0,
    benefits: 0,
    loss: 0
  }
];

// Extract data for the chart
const months = chartData.map(item => item.month);
const totalPurchasePrice = chartData.map(item => item.total_purchase_price);
const totalSales = chartData.map(item => item.total_sales);
const totalExpenses = chartData.map(item => item.total_expenses);
const benefits = chartData.map(item => item.benefits);
const loss = chartData.map(item => item.loss);

// Call chart function
const chartColumnOptions = computed(() => ({
  chart: {
    type: 'column', // Change to 'column' for vertical bars
    animation: {
      enabled: false
    }
  },
  title: {
    text: 'Monthly Financial Data',
  },
  xAxis: {
    categories: months,
    title: {
      text: 'Month'
    },
    labels: {
      rotation: -45, // Optional: Rotate labels if needed
      style: {
        fontSize: '12px',
        fontFamily: 'Arial'
      }
    },
    tickWidth: 0
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Amount (in currency)',
      align: 'high'
    },
    labels: {
      overflow: 'justify'
    }
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true
      },
      pointWidth: 15,
    }
  },
  series: [
    {
      name: 'Total Purchase Price',
      data: totalPurchasePrice,
    },
    {
      name: 'Total Sales',
      data: totalSales
    },
    {
      name: 'Total Expenses',
      data: totalExpenses
    },
    {
      name: 'Benefits',
      data: benefits
    },
    {
      name: 'Loss',
      data: loss
    }
  ]
}));

onMounted(async () => {
  isLoading.value = false;
});
</script>

<template>
  <Title>{{ translations[language].dashboard }}</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <user-outlined />&nbsp;
    <span>{{ translations[language].dashboard }}</span>
  </ATypographyTitle>
  <Loading :is-loading="isLoading" :size="'large'" />
  <a-row class="mt-4" v-if="!isLoading" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <a-row class="mt-4" v-if="!isLoading" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <a-row class="mt-4" v-if="!isLoading" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <a-row class="mt-4" v-if="!isLoading" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <a-row class="mt-4" v-if="!isLoading" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="12">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="primary-color icon-space" />
            <AStatistic title="Sales Daily">1 000 000</AStatistic>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <a-row v-if="!isLoading" class="mt-8" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="24">
      <div class="gutter-box">
        <ACard class="card-space">
          <highchart :options="chartColumnOptions" style="min-height: 440px;" />
        </ACard>
      </div>
    </a-col>
  </a-row>

</template>

<style scoped>
.icon-space {
  font-size: 30px;
}
.card-space {
  box-shadow: rgba(0, 0, 0, 0.24) 0 5px 20px;
}
</style>
