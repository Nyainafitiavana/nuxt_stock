<script setup lang="ts">
import {createVNode, h} from 'vue';
import {
  AInputNumber,
  CheckOutlined, CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined, InfoOutlined,
  PlusOutlined,
  SearchOutlined, StopOutlined,
} from "#components";
import type {SelectValue} from "ant-design-vue/es/select";
import {handleInAuthorizedError} from "~/composables/CustomError";
import type {Paginate} from "~/composables/apiResponse.interface";
import {type FormInstance, Switch} from "ant-design-vue";
import {STCodeList, type TStatus} from "~/composables/Status.interface";
import type {IDetails, IMovement} from "~/composables/Inventory/Movement.interface";
import {
  deleteMovementService, getAllDetailsMovementService,
  getAllMovementService,
  insertOrUpdateMovement
} from "~/composables/Inventory/movement.service";
import type {IProductSalesPrice} from "~/composables/Product/ProductSalesPrice.interface";
import {formatDateString} from "~/composables/helper";
import type {IProduct} from "~/composables/Product/Product.interface";


interface Props {
    activePage: TStatus;
  }


  const props = defineProps<Props>();

  const statusColumn = {
    title: h('div', { style: { textAlign: 'center' } }, ['Status']),
    key: 'status',
    customRender: ({ record }: { record: IMovement}) => h('a-row', [
      record.status.code === STCodeList.OUTSTANDING ?
          h('div',
          {
              style: { textAlign: 'center', color: 'white' },
              class: 'info-background-color'
            },
          ['Outstanding']
          )
          : (
              record.status.code === STCodeList.COMPLETED ?
              h('div',
                {
                  style: { textAlign: 'center', color: 'white' },
                  class: 'success-background-color'
                },
                ['Completed']
              ) :
              h('div',
                {
                  style: { textAlign: 'center', color: 'white' },
                  class: 'danger-background-color'
                },
                ['Deleted']
              )
          )
    ])
  }

  const activeActionsColumns = {
    title: 'Actions',
    key: 'actions',
    width: 200,
    customRender: ({ record }: { record: IMovement }) => h('a-row', [
      h('a-button', {
        class: 'btn--info-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleViewDetailsMovement(record)
      }, [h(InfoOutlined)]),
      h('a-button', {
        class: 'btn--success-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleViewDetailsMovement(record)
      }, [h(CheckOutlined)]),
      h('a-button', {
        class: 'btn--danger-outline btn-tab',
        size: 'large',
        onClick: () => handleViewDetailsMovement(record)
      }, [h(StopOutlined)])
    ])
  };

  const deletedActionColumns = {
    title: 'Actions',
    key: 'actions',
    width: 200,
    customRender: ({ record }: { record: IMovement }) => h('div', [
      h('a-button', {
        class: 'btn--info-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleViewDetailsMovement(record)
      }, [h(InfoOutlined)]),
    ])
  };

  const columnsMovement = [
    {
      title: 'Type',
      key: 'isSales',
      dataIndex: 'isSales',
      customRender: ({ record }: { record: IMovement}) => [record.isSales ? 'Purchase' : 'Sales'],
    },
    {
      title: 'CreatedAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      customRender: ({ record }: { record: IMovement}) => {
        const createdAt: string = formatDateString(record.createdAt);
        return h('div', {style: {textAlign: 'right'}}, [createdAt]);
      }
    },
    {
      title: 'UpdatedAt',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      customRender: ({ record }: { record: IMovement}) => {
        const updatedAt: string = formatDateString(record.updatedAt);
        return h('div', {style: {textAlign: 'right'}}, [updatedAt]);
      }
    },
    {
      title: 'Editor',
      key: 'editor',
      dataIndex: 'editor',
      customRender: ({ record }: { record: IMovement}) => [record.editor.firstName + ' ' + record.editor.lastName],
    },
    {
      title: 'Validator',
      key: 'validator',
      dataIndex: 'validator',
      customRender: ({ record }: { record: IMovement}) => [record.validator ? record.editor.firstName + ' ' + record.editor.lastName : '---'],
    },
    statusColumn,
    props.activePage === STCodeList.OUTSTANDING ?  activeActionsColumns : deletedActionColumns,
  ];

  const actionDetails = {
    title: 'Actions',
    key: 'actions',
    width: 100,
    customRender: ({ record }: { record: IMovement }) => h('row',
        {
          class: 'flex justify-center',
        },
        [h(CloseOutlined, { class: 'danger-color', style: 'font-size: 20px;', onClick: () => {handleRemoveItemDetails(record)} })]
    )
  };

  const unitPriceDetailsColumn = {
    title: 'Unit price',
    key: 'wholesalePrice',
    dataIndex: 'salesPrice',
    customRender: ({ record }: { record: IDetails}) => {
      const value = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(record.salesPrice && record.salesPrice.unitPrice ? record.salesPrice.unitPrice : 0);

      return h('div', { style: { textAlign: 'right' } }, [value]);
    }
  }

  const wholeSalesPriceDetailsColumn = {
    title: 'Wholesale price',
    key: 'wholesalePrice',
    dataIndex: 'salesPrice',
    customRender: ({ record }: { record: IDetails}) => {
      const value = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(record.salesPrice && record.salesPrice.wholesale ? record.salesPrice.wholesale : 0);

      return h('div', { style: { textAlign: 'right' } }, [value]);
    }
  }

  const columnsDetailsMovement = [
    {
      title: 'Product',
      key: 'product',
      dataIndex: ['product', 'designation'],
    },
    {
      title: 'Category',
      key: 'category',
      dataIndex: ['product', 'category', 'designation'],
    },
    {
      title: 'Unit',
      key: 'unit',
      dataIndex: ['product', 'unit', 'designation'],
      width: 100,
    },
    unitPriceDetailsColumn,
    wholeSalesPriceDetailsColumn,
    {
      title: 'Price type',
      key: 'priceType',
      dataIndex: 'isUnitPrice',
      customRender: ({ record }: { record: IDetails }) => {
        return h(Switch, {
          checked: record.isUnitPrice,
          'checked-children': 'Unit',
          'un-checked-children': 'Wholesale',
          onChange: () => {
            record.isUnitPrice = !record.isUnitPrice;
            //We need to reload the amount of details
            getAmountDetails();
          },
        });
      },
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      customRender: ({ record }: { record: IDetails }) => {
        return h(AInputNumber, {
          value: record.quantity,
          class: 'ant-input-status-error',
          min: 0,
          onChange: (value: number) => {
            record.quantity = value ? value : 0;
            //We need to reload the amount of details
            getAmountDetails();
          },
        });
      },
    },
    {
      title: 'Amount',
      key: 'amount',
      customRender: ({ record }: { record: IDetails}) => {
        const price = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.isUnitPrice ? (record.salesPrice.unitPrice * record.quantity) : (record.salesPrice.wholesale * record.quantity));

        return h('div', { style: { textAlign: 'right' } }, [price]);
      }
    },
    actionDetails,
  ];

  const loading = ref<boolean>(false);
  const loadingDetailsMovement = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSizeMovement = ref<number>(10);
  const currentPageMovement = ref<number>(1);
  const totalPageMovement = ref<number>(0);
  const dataMovement = ref<IMovement[]>([]);
  const dataDetailsMovement = ref<IDetails[]>([]);
  const isOpenModal = ref<boolean>(false);
  const movementId = ref<string>('');
  const amountDetail = ref<string>('');

  //************Beginning of modal actions*********************
  const handleShowModalDetails = () => {
    isOpenModal.value = true;
  }

  const handleCloseModalDetails = () => {
    isOpenModal.value = false;
  }
  //************End of modal actions*********************

  //************Add button action*********
  const handleAdd = () => {

  }


  //************Beginning of actions datatable button method**********
  const handleViewDetailsMovement = (record: IMovement) => {
    movementId.value = record.uuid;
    getAllDetailsMovement();
    handleShowModalDetails();
  };

  const handleRemoveItemDetails = (record: IDetails) => {
    dataDetailsMovement.value = dataDetailsMovement.value.filter(item => item.uuid !== record.uuid);
    //We need to reload the amount of details
    getAmountDetails();
  };
  //************End of actions datatable button method**********


  //******************Beginning of CRUD controller**************

  const deleteCategory = async () => {

    try {
      //Call operation API in service
      await deleteMovementService(movementId.value);
      //turn off of loading button and close modal
      loadingBtn.value = false;
      isOpenModal.value = false;
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Operation Successful!',
        class: 'custom-success-notification'
      });

      //reload data
      await getAllDataMovement();
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

  const getAllDataMovement = async () => {
    try {
      loading.value = true;
      const response: Paginate<IMovement[]> = await getAllMovementService(
          false,
          pageSizeMovement.value,
          currentPageMovement.value,
          props.activePage);
      dataMovement.value = response.data;
      totalPageMovement.value = response.totalRows;
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

  const getAllDetailsMovement = async () => {
    try {
      loadingDetailsMovement.value = true;
      const response: Paginate<IDetails[]> = await getAllDetailsMovementService(movementId.value);
      dataDetailsMovement.value = response.data;
      //We need to reload the amount of details
      await getAmountDetails();
      loadingDetailsMovement.value = false;
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

  const getAmountDetails = async () => {
    let amount: number = 0;
    //Browse all item to calculi amount
    dataDetailsMovement.value.map((item: IDetails) => {
      amount += item.isUnitPrice ? (item.salesPrice.unitPrice * item.quantity) : (item.salesPrice.wholesale * item.quantity);
    });
    //format total price
    const formatNumber: string =  new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    //set value of amountDetailState
    if (formatNumber) {
      amountDetail.value = formatNumber;
    }
  }
  //******************End of CRUD controller********************

  //******************Beginning of filter and paginator methods****
  const handleClickPaginatorMovement = () => {
    getAllDataMovement();
  };

  const handleChangePageSizeMovement = (value: SelectValue) => {
    pageSize.value = Number(value);
    currentPage.value = 1;
    getAllDataMovement();
  };

  const handleSearch = () => {
    currentPage.value = 1;
    getAllDataMovement();
  }
  //******************End filter of and paginator methods****


  onMounted(() => {
    getAllDataMovement();
  })
</script>

<template>
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="mt-8" span="5">
      <a-select
          ref="select"
          v-model:value="pageSizeMovement"
          style="width: 80px; text-align: center;"
          @change="handleChangePageSizeMovement"
      >
        <a-select-option value="10">10</a-select-option>
        <a-select-option value="25">25</a-select-option>
        <a-select-option value="50">50</a-select-option>
      </a-select>
      <span> entries per page</span>
    </a-col>
    <a-col class="mt-8" span="7">
      <a-button :icon="h(PlusOutlined)" @click="handleAdd" v-if="props.activePage === STCodeList.OUTSTANDING" class="btn--success ml-5">Add new</a-button>
    </a-col>
    <a-col class="mt-8 flex justify-end" span="12">
      <a-input type="text" class="w-56" v-model:value="keyword" />&nbsp;
      <a-button class="btn--primary" :icon="h(SearchOutlined)" @click="handleSearch"/>
    </a-col>
  </a-row>
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="mt-8" span="24">
      <a-spin :spinning="loading" size="large">
        <a-table
            class="w-full"
            :columns="columnsMovement"
            :data-source="dataMovement"
            :pagination="false"
            :scroll="{ x: 1000, y: 1000 }"
            bordered
        />
      </a-spin>
    </a-col>
  </a-row>
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="mt-8 flex justify-end" span="24">
      <a-pagination
          v-model:current="currentPageMovement"
          v-model:pageSize="pageSizeMovement"
          :total="totalPageMovement"
          @prevClick="handleClickPaginatorMovement"
          @change="handleClickPaginatorMovement"
          @nextClick="handleClickPaginatorMovement"
          :showSizeChanger="false" />
    </a-col>
  </a-row>
  <a-modal
      v-model:open="isOpenModal"
      v-if="isOpenModal"
      closable
      :footer="null"
      title="Movement details"
      style="top: 20px"
      @ok=""
      width="1200px"
  >
    <!--Datatable details movement-->
    <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="mt-8" span="24">
        <a-spin :spinning="loadingDetailsMovement" size="large">
          <a-table
              class="w-full"
              :columns="columnsDetailsMovement"
              :data-source="dataDetailsMovement"
              :pagination="false"
              :scroll="{ x: 1000, y: 1000 }"
              bordered
          />
        </a-spin>
      </a-col>
    </a-row>
    <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="mt-8" span="24">
        <p style="font-size: 18px;">Total : {{ amountDetail }}</p>
      </a-col>
    </a-row>
  </a-modal>
</template>

<style scoped>

</style>