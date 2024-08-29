<script setup lang="ts">

  import type {IProductRemainingStock} from "~/composables/Product/Product.interface";
  import type {SelectProps} from "ant-design-vue/lib";
  import type {Paginate} from "~/composables/apiResponse.interface";
  import {getAllProductWithRemainingStockService} from "~/composables/Product/product.service";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import type {SelectValue} from "ant-design-vue/es/select";
  import type {ICategory} from "~/composables/Category/Category.interface";
  import {getAllCategory} from "~/composables/Category/category.service";
  import {STCodeList} from "~/composables/Status.interface";
  import type {IUnit} from "~/composables/Unit/Unit.interface";
  import {getAllUnit} from "~/composables/Unit/unit.service";
  import {h} from "vue";
  import {
    AButton,
    ARow,
    ASelect,
    CaretDownOutlined,
    CaretUpOutlined,
    SearchOutlined
  } from "#components";

  definePageMeta({
    layout: 'navbar',
    title: 'Stock_situation',
    middleware: ['user-middleware']
  });

  //**************Beginning of state management**************
  const loading = ref<boolean>(false);
  const loadingCategoryFilterList = ref<boolean>(false);
  const loadingUnitFilterList = ref<boolean>(false);
  const dataProductWithRemainingStock = ref<IProductRemainingStock[]>([]);
  const optionsCategory = ref<SelectProps['options']>([{ value: '', label: 'All'}]);
  const currentCategoryList = ref<string>('');
  const optionsUnit = ref<SelectProps['options']>([{ value: '', label: 'All'}]);
  const currentUnitList = ref<string>('');
  const keyword = ref<string>('');
  const pageSize = ref<number>(10);
  const currentPage = ref<number>(1);
  const totalPage = ref<number>(0);
  const stockThreshold = ref<number>(70);
  //**************End of state management**************
  //***********Beginning of select method of category product***************
  const filterOption = (input: string, option: any) => {
    return option?.label?.toLowerCase().includes(input.toLowerCase());
  };

  const handleChangeFilterCategoryInList = () => {
    getAllDataProductWithRemainingStock();
  };

  const handleChangeFilterUnitInList = () => {
    getAllDataProductWithRemainingStock();
  };
  //***********End of select method of category product***************
  //**************Beginning of Datatable column**************
  let columnsProductWithRemainingStock = [];

  const initColumnDatatable = () => {
    columnsProductWithRemainingStock = [
      {
        title: 'Product',
        key: 'product',
        dataIndex: 'product_name',
        width: 200,
      },
      {
        title: 'Category',
        key: 'category',
        dataIndex: 'category_name',
      },
      {
        title: 'Unit',
        key: 'unit',
        dataIndex: 'unit_name',
        width: 80,
      },
      {
        title: 'Stock input',
        key: 'stockInput',
        dataIndex: 'stock_input',
        customRender: ({ record }: { record: IProductRemainingStock}) => [
          h('div', [
            h(CaretDownOutlined, { style: {fontSize: '30px'}, class: 'success-color' }),
            h('span', [record.stock_input]),
          ]),
        ]
      },
      {
        title: 'Stock output',
        key: 'stockOutput',
        dataIndex: 'stock_output',
        customRender: ({ record }: { record: IProductRemainingStock}) => [
          h('div', [
            h(CaretUpOutlined, { style: {fontSize: '30px'}, class: 'danger-color' }),
            h('span', [record.stock_output]),
          ]),
        ]
      },
      {
        title: h('div', { style: { textAlign: 'center' } }, ['Remaining stock']),
        key: 'remainingStock',
        dataIndex: 'remaining_stock',
        customRender: ({ record }: { record: IProductRemainingStock}) => [
          h('div', {
            style: { textAlign: 'center', color: 'white', fontWeight: '800' },
            class: record.remaining_stock === 0 ? 'danger-background-color' : ( record.remaining_stock > 0 && record.remaining_stock <= stockThreshold.value ? 'warning-background-color' : 'primary-background-color')
          }, [
            h('span', [record.remaining_stock]),
          ]),
        ]
      },
    ];
  }
  //**************End of Datatable column**************
  //******************Beginning of CRUD controller**************
  const getAllDataProductWithRemainingStock = async () => {
    try {
      loading.value = true;
      const response: Paginate<dataProductWithRemainingStock[]> = await getAllProductWithRemainingStockService(
          keyword.value,
          pageSize.value,
          currentPage.value,
          currentCategoryList.value,
          currentUnitList.value,
      );
      dataProductWithRemainingStock.value = response.data;
      totalPage.value = response.totalRows;
      loading.value = false;
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
        message: 'Error',
        description: (error as Error).message,
        class: 'custom-error-notification'
      });
    }
  }

  const getAllDataCategory = async () => {
    try {
      loadingCategoryFilterList.value = true;
      const response: Paginate<ICategory[]> = await getAllCategory(
          '',
          '',
          '',
          STCodeList.ACTIVE);
      response.data.map((item: ICategory) => {
        if (optionsCategory.value) {
          optionsCategory.value.push({ value: item.uuid, label: item.designation });
        }
      });

      await nextTick(); // Ensure the DOM updates before proceeding
      loadingCategoryFilterList.value = false;
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
        message: 'Error',
        description: (error as Error).message,
        class: 'custom-error-notification'
      });
    }
  }

  const getAllDataUnit = async () => {
    try {
      loadingUnitFilterList.value = true;
      const response: Paginate<IUnit[]> = await getAllUnit(
          '',
          '',
          '',
          STCodeList.ACTIVE);
      response.data.map((item: IUnit) => {
        if (optionsUnit.value) {
          optionsUnit.value.push({ value: item.uuid, label: item.designation });
        }
      });

      await nextTick(); // Ensure the DOM updates before proceeding
      loadingUnitFilterList.value = false;
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
        message: 'Error',
        description: (error as Error).message,
        class: 'custom-error-notification'
      });
    }
  }
  //******************End of CRUD controller**************
  //******************Beginning of filter and paginator methods****
  const handleClickPaginator = () => {
    getAllDataProductWithRemainingStock();
  };

  const handleChangePageSize = (value: SelectValue) => {
    pageSize.value = Number(value);
    currentPage.value = 1;
    getAllDataProductWithRemainingStock();
  };

  const handleSearch = () => {
    currentPage.value = 1;
    getAllDataProductWithRemainingStock();
  }
  //******************End filter of and paginator methods****

  onMounted(() => {
    getAllDataCategory();
    getAllDataUnit();
    getAllDataProductWithRemainingStock();
    initColumnDatatable();
  })
</script>

<template>
  <Title>Stock situation</Title>
  <ATypographyTitle class="flex" style="font-size: 20px;">
    <VerticalAlignMiddleOutlined />
    <span>Stock situation</span>
  </ATypographyTitle>
  <!-- Sort page, add btn, sort by category, search -->
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <!-- Page size -->
    <a-col class="mt-8" span="6">
      <a-select
          ref="select"
          v-model:value="pageSize"
          style="width: 80px; text-align: center;"
          @change="handleChangePageSize"
      >
        <a-select-option value="10">10</a-select-option>
        <a-select-option value="25">25</a-select-option>
        <a-select-option value="50">50</a-select-option>
      </a-select>
      <span> / page</span>
    </a-col>
    <!-- Sort by category -->
    <a-col class="mt-8" span="6">
      <span>Category : </span>
      <a-select
          class="w-44"
          v-model:value="currentCategoryList"
          show-search
          :options="optionsCategory"
          :filter-option="filterOption"
          @change="handleChangeFilterCategoryInList"
          :disabled="isView"
          :loading="loadingCategoryFilterList"
      ></a-select>
    </a-col>
    <!-- Sort by unit -->
    <a-col class="mt-8" span="6">
      <span>Unit : </span>
      <a-select
          class="w-44"
          v-model:value="currentUnitList"
          show-search
          :options="optionsUnit"
          :filter-option="filterOption"
          @change="handleChangeFilterUnitInList"
          :loading="loadingUnitFilterList"
      ></a-select>
    </a-col>
    <!-- Search input -->
    <a-col class="mt-8 flex justify-end" span="6">
      <a-input type="text" class="w-48 h-9" v-model:value="keyword" placeholder="Search"/>&nbsp;
      <a-button class="btn--primary" :icon="h(SearchOutlined)" @click="handleSearch"/>
    </a-col>
  </a-row>
  <!-- Datatable -->
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="mt-8" span="24">
      <a-spin :spinning="loading" size="large">
        <a-table
            class="w-full"
            :columns="columnsProductWithRemainingStock"
            :data-source="dataProductWithRemainingStock"
            :pagination="false"
            :scroll="{ x: 1200, y: 1000 }"
            bordered
        />
      </a-spin>
    </a-col>
  </a-row>
  <!-- Pagination -->
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="mt-8 flex justify-end" span="24">
      <a-pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="totalPage"
          @prevClick="handleClickPaginator"
          @change="handleClickPaginator"
          @nextClick="handleClickPaginator"
          :showSizeChanger="false" />
    </a-col>
  </a-row>
  <!-- Legend -->
  <a-row class="mt-8 flex justify-center" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col  span="6" class="flex">
      <div class="primary-background-color w-12 h-5"></div>
      <h6 class="ml-4">Product available in stock</h6>
    </a-col>
    <a-col  span="6" class="flex">
      <div class="warning-background-color w-12 h-5"></div>
      <h6 class="ml-4">Product out of stock</h6>
    </a-col>
    <a-col  span="6" class="flex">
      <div class="danger-background-color w-12 h-5"></div>
      <h6 class="ml-4">Product unavailable stock</h6>
    </a-col>
  </a-row>
</template>

<style scoped>

</style>