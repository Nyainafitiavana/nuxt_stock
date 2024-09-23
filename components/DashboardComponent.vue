<script setup lang="ts">
  import Highcharts from 'highcharts';
  import {translations} from "~/composables/translations";
  import {computed, onMounted, ref} from "vue";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import type {
    ICashGlobalSummary, IExpensesCash, IProfitLoss, ISalesPurchase,
  } from "~/composables/cash/cashSummary.interface";
  import {
    getCashSummaryGlobalService, getExpensesCashService,
    getProfitAndLossService, getSalesPurchaseService
  } from "~/composables/cash/cashSummary.service";
  import type {ICurrency} from "~/composables/settings/general/settings.interface";
  import {getCurrencyService} from "~/composables/settings/general/settings.service";
  import type {SelectProps} from "ant-design-vue/lib";

  // This is a global state for language of the app
  const language = useLanguage();

  const loadingGlobalCash = ref<boolean>(false);
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
  const optionsMode = ref<SelectProps['options']>([
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
  ]);
  const currencyType = ref<string>('');

  //Ref for Profit and loss
  const loadingProfitLoss = ref<boolean>(false);
  const modeChartProfitLoss = ref<'weekly' | 'monthly' | 'yearly'>('monthly');
  const xAxisProfitLoss = ref<any>([]);
  const profitAmount = ref<number[]>([]);
  const lossAmount = ref<number[]>([]);
  //Ref for Sales and purchase
  const loadingSalesPurchase = ref<boolean>(false);
  const modeChartSalesPurchase = ref<'weekly' | 'monthly' | 'yearly'>('monthly');
  const xAxisSalesPurchase = ref<any>([]);
  const salesAmount = ref<number[]>([]);
  const purchaseAmount = ref<number[]>([]);
  //Ref for Expenses
  const loadingExpenses = ref<boolean>(false);
  const modeChartExpenses = ref<'weekly' | 'monthly' | 'yearly'>('monthly');
  const xAxisExpenses = ref<any>([]);
  const expensesAmount = ref<number[]>([]);

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

  const getProfitAndLoss = async () => {
    try {
      loadingProfitLoss.value = true;
      // Clear previous data
      xAxisProfitLoss.value = [];
      profitAmount.value = [];
      lossAmount.value = [];

      const result: IProfitLoss[]  = await getProfitAndLossService(modeChartProfitLoss.value);

      result.map(item => {
        xAxisProfitLoss.value.push(modeChartProfitLoss.value === 'weekly' ? formatDateString(item.x_series, language.value, false) : item.x_series);
        profitAmount.value.push(item.total_profit_amount);
        lossAmount.value.push(item.total_loss_amount);
      });

      loadingProfitLoss.value = false;
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

      loadingProfitLoss.value = false;
    }
  }

  const getSalesAndPurchase = async () => {
    try {
      loadingSalesPurchase.value = true;
      // Clear previous data
      xAxisSalesPurchase.value = [];
      salesAmount.value = [];
      purchaseAmount.value = [];

      const result: ISalesPurchase[]  = await getSalesPurchaseService(modeChartSalesPurchase.value);

      result.map(item => {
        xAxisSalesPurchase.value.push(modeChartSalesPurchase.value === 'weekly' ? formatDateString(item.x_series, language.value, false) : item.x_series);
        salesAmount.value.push(item.total_sales_amount);
        purchaseAmount.value.push(item.total_purchase_amount);
      });

      loadingSalesPurchase.value = false;
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

      loadingSalesPurchase.value = false;
    }
  }

  const getExpenses = async () => {
    try {
      loadingExpenses.value = true;
      // Clear previous data
      xAxisExpenses.value = [];
      expensesAmount.value = [];

      const result: IExpensesCash[]  = await getExpensesCashService(modeChartExpenses.value);

      result.map(item => {
        xAxisExpenses.value.push(modeChartExpenses.value === 'weekly' ? formatDateString(item.x_series, language.value, false) : item.x_series);
        expensesAmount.value.push(item.total_expenses_amount);
      });

      loadingExpenses.value = false;
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

      loadingExpenses.value = false;
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

  watchEffect(() => {
    if (optionsMode.value) {
      optionsMode.value[0].label = translations[language.value].weekly;
      optionsMode.value[1].label = translations[language.value].monthly;
      optionsMode.value[2].label = translations[language.value].yearly;
    }
  });

  // Watch for mode changes of modeChartProfitLoss and re-fetch data, then re-render chart
  watch(modeChartProfitLoss, async () => {
    await getProfitAndLoss(); // Fetch new data when mode changes
  });

  // Watch for mode changes of modeChartSalesPurchase and re-fetch data, then re-render chart
  watch(modeChartSalesPurchase, async () => {
    await getSalesAndPurchase(); // Fetch new data when mode changes
  });

  // Watch for mode changes of modeChartExpenses and re-fetch data, then re-render chart
  watch(modeChartExpenses, async () => {
    await getExpenses(); // Fetch new data when mode changes
  });

  onMounted( async () => {
    await getCurrencyType();
    await getAllDataGlobalCashSummary();
    await getProfitAndLoss();
    await getSalesAndPurchase();
    await getExpenses();
  });

  // Call chart function
  //Profit and loss chart
  const chartColumnProfitLossOptions = computed(() => ({
    chart: {
      type: 'area', // Change to 'column' for vertical bars
      animation: {
        enabled: false
      }
    },
    title: {
      text: translations[language.value].profitsLosses,
    },
    xAxis: {
      categories: xAxisProfitLoss.value,
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
        text: translations[language.value].amount + " (" + (language.value === 'ENG' ? 'in ' : 'en ') + currencyType.value + ")",
        align: 'high'
      },
      labels: {
        overflow: 'justify',
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineWidth: 1,
        marker: {
          enabled: false
        },
        dataLabels: {
          enabled: true,
          formatter(this: Highcharts.Point): string {
            return formatPrice(this.y as number) + ' ' + currencyType.value;
          }
        }
      }
    },
    series: [
      {
        name: translations[language.value].profits,
        data: profitAmount.value
      },
      {
        name: translations[language.value].losses,
        data: lossAmount.value
      }
    ]
  }));
  //Sales and purchase chart
  const chartColumnSalesPurchaseOptions = computed(() => ({
    chart: {
      type: 'column', // Change to 'column' for vertical bars
      animation: {
        enabled: false
      }
    },
    title: {
      text: translations[language.value].salesPurchases,
    },
    xAxis: {
      categories: xAxisSalesPurchase.value,
      labels: {
        rotation: -45, // Optional: Rotate labels if needed
        style: {
          fontSize: '12px',
          fontFamily: 'Arial'
        },
      },
      tickWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: translations[language.value].amount + " (" + (language.value === 'ENG' ? 'in ' : 'en ') + currencyType.value + ")",
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter(this: Highcharts.Point): string {
            return formatPrice(this.y as number) + ' ' + currencyType.value;
          }
        }
      }
    },
    series: [
      {
        name: translations[language.value].sales,
        color: '#38c172',
        data: salesAmount.value
      },
      {
        name: translations[language.value].purchase,
        color: '#3490dc',
        data: purchaseAmount.value
      }
    ]
  }));
  //Expenses chart
  const chartColumnExpensesOptions = computed(() => ({
    chart: {
      type: 'area', // Change to 'column' for vertical bars
      animation: {
        enabled: false
      }
    },
    title: {
      text: translations[language.value].expenses,
    },
    xAxis: {
      categories: xAxisExpenses.value,
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
        text: translations[language.value].amount + " (" + (language.value === 'ENG' ? 'in ' : 'en ') + currencyType.value + ")",
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineWidth: 1,
        marker: {
          enabled: false
        },
        dataLabels: {
          enabled: true,
          formatter(this: Highcharts.Point): string {
            return formatPrice(this.y as number) + ' ' + currencyType.value;
          }
        }
      }
    },
    series: [
      {
        name: translations[language.value].expenses,
        color: '#e5b33e',
        data: expensesAmount.value
      },
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
            <AStatistic :title="translations[language].presentSales" :value="dataCashGlobalSummary.presentSalesAmount"/>
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
            <AStatistic :title="translations[language].presentPurchase" :value="dataCashGlobalSummary.presentPurchaseAmount"/>
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
            <AStatistic :title="translations[language].presentExpenses" :value="dataCashGlobalSummary.presentExpensesAmount"/>
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
            <AStatistic :title="translations[language].initialCash" :value="dataCashGlobalSummary.initial_cash"/>
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
            <AStatistic :title="translations[language].totalOfSales" :value="dataCashGlobalSummary.totalAmountSales"/>
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
            <AStatistic :title="translations[language].totalOfPurchase" :value="dataCashGlobalSummary.totalAmountPurchase"/>
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
            <AStatistic :title="translations[language].totalOfExpenses" :value="dataCashGlobalSummary.amountExpenses"/>
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
            <AStatistic :title="translations[language].realCash" :value="dataCashGlobalSummary.real_cash"/>
            <span>{{ currencyType }}</span>
          </ASpace>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <!--Profit and loss chart-->
  <a-row class="mt-8" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="gutter-row" :span="24">
      <div class="gutter-box">
        <ACard class="card-space" style="min-height: 500px;">
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col class="gutter-row" :span="24">
              <a-select
                  v-model:value="modeChartProfitLoss"
                  :options="optionsMode"
                  placeholder=""
                  style="width: 200px"
              />
            </a-col>
          </a-row>
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col class="gutter-row" :span="24">
              <a-spin :spinning="loadingProfitLoss" size="default">
                <highchart v-if="!loadingProfitLoss" :options="chartColumnProfitLossOptions"/>
              </a-spin>
            </a-col>
          </a-row>
        </ACard>
      </div>
    </a-col>
  </a-row>
  <!--Sales and Purchase chart-->
  <a-row class="mt-8" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col :span="12">
      <div class="gutter-box">
        <ACard class="card-space" style="min-height: 500px;">
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col class="gutter-row" :span="24">
              <a-select
                  v-model:value="modeChartSalesPurchase"
                  :options="optionsMode"
                  placeholder=""
                  style="width: 200px"
              />
            </a-col>
          </a-row>
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col class="gutter-row" :span="24">
              <a-spin :spinning="loadingSalesPurchase" size="default">
                <highchart v-if="!loadingSalesPurchase" :options="chartColumnSalesPurchaseOptions"/>
              </a-spin>
            </a-col>
          </a-row>
        </ACard>
      </div>
    </a-col>
    <a-col :span="12">
      <div class="gutter-box">
        <ACard class="card-space" style="min-height: 500px;">
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col class="gutter-row" :span="24">
              <a-select
                  v-model:value="modeChartExpenses"
                  :options="optionsMode"
                  placeholder=""
                  style="width: 200px"
              />
            </a-col>
          </a-row>
          <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
            <a-col class="gutter-row" :span="24">
              <a-spin :spinning="loadingExpenses" size="default">
                <highchart v-if="!loadingExpenses" :options="chartColumnExpensesOptions"/>
              </a-spin>
            </a-col>
          </a-row>
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
