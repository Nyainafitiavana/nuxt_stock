<script setup lang="ts">
  import {translations} from "~/composables/translations";
  import {computed, onMounted, ref} from "vue";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import type {
    ICashDetail,
    ICashGlobalSummary,
  } from "~/composables/cash/cashSummary.interface";
  import {getCashDetailsService, getCashSummaryGlobalService} from "~/composables/cash/cashSummary.service";
  import type {ICurrency} from "~/composables/settings/general/settings.interface";
  import {getCurrencyService} from "~/composables/settings/general/settings.service";
  import type {SelectProps} from "ant-design-vue/lib";

  // This is a global state for language of the app
  const language = useLanguage();

  const loadingGlobalCash = ref<boolean>(false);
  const loadingDetailCash = ref<boolean>(false);
  const dataCashGlobalSummary = reactive<ICashGlobalSummary>({
    amountExpenses: 0,
    amount_input: 0,
    amount_output: 0,
    initial_cash: 0,
    presentExpensesAmount: 0,
    presentPurchaseAmount: 0,
    presentSalesAmount: 0,
    real_cash: 0,
    totalAmountPurchase: 0,
    totalAmountSales: 0
  });
  const currencyType = ref<string>('');
  const optionsModeCashDetail = ref<SelectProps['options']>([
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ]);
  const modeChartCashDetail = ref<'weekly' | 'monthly' | 'yearly'>('monthly');
  const xAxis = ref<any>([]);
  const totalPurchasePrice = ref<any>([]);
  const totalSales = ref<number[]>([]);
  const totalExpenses = ref<number[]>([]);
  const benefits = ref<number[]>([]);
  const loss = ref<number[]>([]);

  const getAllDataGlobalCashSummary = async () => {
    try {
      loadingGlobalCash.value = true;
      const response: ICashGlobalSummary = await getCashSummaryGlobalService();

      dataCashGlobalSummary.initial_cash = response.initial_cash;
      dataCashGlobalSummary.presentSalesAmount = response.presentSalesAmount;
      dataCashGlobalSummary.presentPurchaseAmount = response.presentPurchaseAmount;
      dataCashGlobalSummary.presentExpensesAmount = response.presentExpensesAmount;
      dataCashGlobalSummary.totalAmountSales = response.totalAmountSales;
      dataCashGlobalSummary.totalAmountPurchase = response.totalAmountPurchase;
      dataCashGlobalSummary.amountExpenses = response.amountExpenses;
      dataCashGlobalSummary.amount_output = response.amount_output;
      dataCashGlobalSummary.amount_input = response.amount_input;
      dataCashGlobalSummary.real_cash = response.real_cash;
      loadingGlobalCash.value = false;
    } catch (error) {
      //Verification code status if equal 401 then we redirect to log in
      if (error instanceof CustomError) {
        if (error.status === 401) {
          //call the global handle action if in authorized
          handleInAuthorizedError(error);
          return;
        }
      }

      // Show error notification
      notification.error({
        message: translations[language.value].error,
        description: (error as Error).message,
        class: 'custom-error-notification'
      });

      loadingGlobalCash.value = false;
    }
  }

  const getAllDataCashDetails = async () => {
    try {
      loadingDetailCash.value = true;
      // Clear previous data
      xAxis.value = [];
      totalPurchasePrice.value = [];
      totalSales.value = [];
      totalExpenses.value = [];
      benefits.value = [];
      loss.value = [];

      const result: ICashDetail[]  = await getCashDetailsService(modeChartCashDetail.value);

      result.map(item => {
        xAxis.value.push(modeChartCashDetail.value === 'weekly' ? formatDateString(item.x_series, language.value, false) : item.x_series);
        totalPurchasePrice.value.push(item.total_purchase_price);
        totalSales.value.push(item.total_sales);
        totalExpenses.value.push(item.total_expenses);
        benefits.value.push(item.benefits);
        loss.value.push(item.loss);
      });

      loadingDetailCash.value = false;
    } catch (error) {
      //Verification code status if equal 401 then we redirect to log in
      if (error instanceof CustomError) {
        if (error.status === 401) {
          //call the global handle action if in authorized
          handleInAuthorizedError(error);
          return;
        }
      }

      // Show error notification
      notification.error({
        message: translations[language.value].error,
        description: (error as Error).message,
        class: 'custom-error-notification'
      });

      loadingDetailCash.value = false;
    }
  }

  const getCurrencyType = async () => {
    try {
      const dataCurrencyType: ICurrency = await getCurrencyService();

      currencyType.value = dataCurrencyType.currencyType;

    } catch (error) {
      //Verification code status if equal 401 then we redirect to log in
      if (error instanceof CustomError) {
        if (error.status === 401) {
          //call the global handle action if in authorized
          handleInAuthorizedError(error);
          return;
        }
      }

      // Show error notification
      notification.error({
        message: translations[language.value].error,
        description: (error as Error).message,
        class: 'custom-error-notification'
      });
    }
  }

  // Watch for mode changes and re-fetch data, then re-render chart
  watch(modeChartCashDetail, async () => {
    await getAllDataCashDetails(); // Fetch new data when mode changes
  });

  onMounted( async () => {
    await getCurrencyType();
    await getAllDataGlobalCashSummary();
    await getAllDataCashDetails();
  });

  // Call chart function
  const chartColumnOptions = computed(() => ({
    chart: {
      type: 'column', // Change to 'column' for vertical bars
      animation: {
        enabled: false
      }
    },
    title: {
      text: 'Details of cash',
    },
    xAxis: {
      categories: xAxis.value,
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
        text: '',
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
        data: totalPurchasePrice.value,
      },
      {
        name: 'Total Sales',
        data: totalSales.value
      },
      {
        name: 'Total Expenses',
        data: totalExpenses.value
      },
      {
        name: 'Benefits',
        data: benefits.value
      },
      {
        name: 'Loss',
        data: loss.value
      }
    ]
  }));
</script>

<template>
  <Title>{{ translations[language].dashboard }}</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <user-outlined />&nbsp;
    <span>{{ translations[language].dashboard }}</span>
  </ATypographyTitle>
  <!--Beginning of spaces-->
  <a-row class="mt-5" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="success-color icon-space" />
            <AStatistic title="Present sales" :value="dataCashGlobalSummary.presentSalesAmount"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingCartOutlined class="info-color icon-space" />
            <AStatistic title="Present purchase" :value="dataCashGlobalSummary.presentPurchaseAmount"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <WalletOutlined class="warning-color icon-space" />
            <AStatistic title="Present expenses" :value="dataCashGlobalSummary.presentExpensesAmount"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <MoneyCollectOutlined class="primary-color icon-space" />
            <AStatistic title="Initial cash" :value="dataCashGlobalSummary.initial_cash"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <a-row class="mt-4" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingOutlined class="success-color icon-space" />
            <AStatistic title="Total of sales" :value="dataCashGlobalSummary.totalAmountSales"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <ShoppingCartOutlined class="info-color icon-space" />
            <AStatistic title="Total of purchase" :value="dataCashGlobalSummary.totalAmountPurchase"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <WalletOutlined class="warning-color icon-space" />
            <AStatistic title="Total of expenses" :value="dataCashGlobalSummary.amountExpenses"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <ACard class="card-space">
          <ASpace direction="horizontal">
            <MoneyCollectOutlined class="primary-color icon-space" />
            <AStatistic title="Real cash" :value="dataCashGlobalSummary.real_cash"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <!--Cash summary graph-->
  <a-row class="mt-8" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="24">
      <div class="gutter-box">
        <ACard class="card-space" style="min-height: 500px;">
          <a-select
              v-model:value="modeChartCashDetail"
              :options="optionsModeCashDetail"
              placeholder=""
              style="width: 200px"
          />
          <a-spin :spinning="loadingDetailCash" size="default"></a-spin>
          <highchart v-if="!loadingDetailCash" :options="chartColumnOptions"/>
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
