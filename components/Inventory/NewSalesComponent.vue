<script setup lang="ts">
  import type {SelectValue} from "ant-design-vue/es/select";
  import type {Paginate} from "~/composables/apiResponse.interface";
  import type {IProduct, IProductRemainingStock} from "~/composables/Product/Product.interface";
  import {
    getAllDataProductService,
    getAllProductWithRemainingStockService
  } from "~/composables/Product/product.service";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import type {IDetails, IFormDetails} from "~/composables/Inventory/Movement.interface";
  import {createVNode, h} from "vue";
  import {
    AButton,
    AInputNumber,
    ASelect,
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
  } from "#components";
  import {Switch} from "ant-design-vue";
  import {createNewMovementService} from "~/composables/Inventory/movement.service";

  //**************Beginning of state management**************
  const loading = ref<boolean>(false);
  const loadingDetailsMovement = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const isOpenModalPannier = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSize = ref<number>(10);
  const currentPage = ref<number>(1);
  const totalPage = ref<number>(0);
  const dataProductWithRemainingStock = ref<IProductRemainingStock[]>([]);
  const dataDetailsMovement = ref<IDetails[]>([]);
  const itemInPannier = ref<number>(localStorage.getItem('pannier') ? (JSON.parse(localStorage.getItem('pannier'))).length : 0);
  const amountDetail = ref<string>('');
  const errorMessageDetails = ref<string>('');
  const isShowErrorDetail = ref<boolean>(false);
  //**************End of state management**************
  //**************Beginning of Datatable column**************
  const columnsProductWithRemainingStock = [
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
      title: 'Unit price',
      key: 'unitPrice',
      dataIndex: 'unit_price',
      customRender: ({ record }: { record: IProductRemainingStock}) => {
        const value = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.unit_price ? record.unit_price : 0);

        return h('div', { style: { textAlign: 'right' } }, [value]);
      }
    },
    {
      title: 'Wholesale price',
      key: 'wholesalePrice',
      dataIndex: 'wholesale_price',
      customRender: ({ record }: { record: IProductRemainingStock}) => {
        const value = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.wholesale_price ? record.wholesale_price : 0);

        return h('div', { style: { textAlign: 'right' } }, [value]);
      }
    },
    {
      title: 'Remaining stock',
      key: 'remainingStock',
      dataIndex: 'remaining_stock',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      customRender: ({ record }: { record: IProductRemainingStock }) => {
        const pannierStorage = localStorage.getItem('pannier');
        //If pannier is not empty, we need to check if record is not already there
        if (pannierStorage && pannierStorage !== '') {
          const pannierList: IProductRemainingStock[] = JSON.parse(pannierStorage);
          //Find record item in pannierList
          const findRecordInPannier = pannierList.find(item => item.product_id === record.product_id);

          if (findRecordInPannier) {
            //if already exist, we return the remove btn
            return h('a-button', { class: 'btn--danger btn-tab', onClick: () => handleRemoveItemPannier(record)}, [h(DeleteOutlined)])
          } else {
            //record not exist in pannier we return the add btn
            return h('a-button', { class: 'btn--primary btn-tab', onClick: () => handleAddItemPannier(record)}, [h(PlusOutlined)])
          }
        } else {
          //If pannier is empty we return the add btn
          return h('a-button', { class: 'btn--primary btn-tab', onClick: () => handleAddItemPannier(record)}, [h(PlusOutlined)])
        }
      }
    },
  ];

  const columnsDetailsMovement = [
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
      title: 'Unit price',
      key: 'unitPrice',
      dataIndex: 'unit_price',
      customRender: ({ record }: { record: IDetails}) => {
        const value = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.unit_price ? record.unit_price : 0);

        return h('div', { style: { textAlign: 'right' } }, [value]);
      }
    },
    {
      title: 'Wholesale price',
      key: 'wholesalePrice',
      dataIndex: 'wholesale_price',
      customRender: ({ record }: { record: IDetails}) => {
        const value = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.wholesale_price ? record.wholesale_price : 0);

        return h('div', { style: { textAlign: 'right' } }, [value]);
      }
    },
    {
      title: 'Price type',
      key: 'priceType',
      dataIndex: 'is_unit_price',
      width: 120,
      customRender: ({ record }: { record: IDetails }) => {
        return h(Switch, {
          checked: record.is_unit_price,
          'checked-children': 'Unit',
          'un-checked-children': 'Wholesale',
          onChange: () => {
            record.is_unit_price = !record.is_unit_price;
            //We need to reload the amount of details
            getAmountDetails();
          },
        });
      },
    },
    {
      title: 'Remaining stock',
      key: 'remainingStock',
      dataIndex: 'remaining_stock',
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      width: 120,
      customRender: ({ record }: { record: IDetails }) => {
        return h(AInputNumber, {
          value: record.quantity,
          class: 'ant-input-status-error',
          min: 0,
          max: record.remaining_stock,
          onChange: (value: number) => {
            //Guard of max quantity
            if (record.quantity > record.remaining_stock) {
              record.quantity = 0;
            } else {
              record.quantity = value ? value : 0;
            }

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
        }).format(record.is_unit_price ? (record.unit_price * record.quantity) : (record.wholesale_price * record.quantity));

        return h('div', { style: { textAlign: 'right' } }, [price]);
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      customRender: ({ record }: { record: IDetails }) => h('row',
          {
            class: 'flex justify-center',
          },
          [
            h(AButton, {
              class: 'btn--danger-outline btn-tab',
              size: 'large',
              onClick: () => handleRemoveItemDetails(record)
            }, [h(DeleteOutlined)])
          ]
      )
    },
  ];
  //**************End of Datatable column**************

  //******************Beginning action pannier********************
  const handleAddItemPannier = async (record: IProductRemainingStock) => {
    const newDataPannier: IDetails = {
      product_id: record.product_id,
      product_name: record.product_name,
      quantity: 0,
      category_id: record.category_id,
      category_name: record.category_name,
      unit_id: record.unit_id,
      unit_name: record.unit_name,
      is_unit_price: true,
      product_sales_price_id: record.product_sales_price_id,
      unit_price: record.unit_price,
      wholesale_price: record.wholesale_price,
      purchase_price: record.purchase_price,
      remaining_stock: record.remaining_stock,
    };

    const pannierStorage = await localStorage.getItem('pannier');

    if (pannierStorage && pannierStorage !== '') {
      let pannierList: IDetails[] = JSON.parse(pannierStorage);
      pannierList.push(newDataPannier);

      await localStorage.setItem('pannier', JSON.stringify(pannierList));
      await updateCountPannier();
      await getAllDataProductWithRemainingStock();
    } else {
      await localStorage.setItem('pannier', JSON.stringify([newDataPannier]));
      await updateCountPannier();
      await getAllDataProductWithRemainingStock();
    }
  }

  const handleRemoveItemPannier = async (record: IProductRemainingStock) => {
    const pannierStorage = await localStorage.getItem('pannier');
    const pannierList: IDetails[] = JSON.parse(pannierStorage);

    const updatedPannier: IDetails[] = pannierList.filter(item => item.product_id !== record.product_id);
    await localStorage.setItem('pannier', JSON.stringify(updatedPannier));
    await updateCountPannier();
    await getAllDataProductWithRemainingStock();
  }

  const updateCountPannier = async () => {
    const pannierStorage = await localStorage.getItem('pannier');

    if (pannierStorage && pannierStorage !== '') {
      const pannierList: IDetails[] = JSON.parse(pannierStorage);
      //set value with pannierList length
      itemInPannier.value = pannierList.length;
    } else {
      //rest with default value pannier not found
      itemInPannier.value = 0;
    }

  }

  const updatePannierList = async () => {
    const pannierStorage = await localStorage.getItem('pannier');

    if (pannierStorage && pannierStorage !== '') {
      dataDetailsMovement.value = JSON.parse(pannierStorage);
      loadingDetailsMovement.value = false;
    }
  }

  const saveChangePannierTemporarily = async () => {
    localStorage.setItem('pannier', JSON.stringify(dataDetailsMovement.value));
    await updateCountPannier();
    await getAllDataProductWithRemainingStock();
  }

  const handleRemoveItemDetails = async (record: IDetails) => {
    dataDetailsMovement.value = dataDetailsMovement.value.filter(item => item.product_id !== record.product_id);
    //We need to reload the amount of details
    await getAmountDetails();
  };

  const handleShowModalPannier = async () => {
    loadingDetailsMovement.value = true;
    errorMessageDetails.value = '';
    isShowErrorDetail.value = false;
    await updatePannierList();

    isOpenModalPannier.value = true;
  }

  const handleCloseModalPannier = () => {
    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you want to save all changed temporarily?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        await saveChangePannierTemporarily();
        isOpenModalPannier.value = false;
      },
      onCancel: () => {
        isOpenModalPannier.value = false;
      }
    });

  }

  const getAmountDetails = async () => {
    let amount: number = 0;
    //Browse all item to calculi amount
    dataDetailsMovement.value.map((item: IDetails) => {
      amount += item.is_unit_price ? (item.unit_price * item.quantity) : (item.wholesale_price * item.quantity);
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

  const handleSaveMovement = async () => {
    if (dataDetailsMovement.value !== []) {
      const indexEmptyQuantity = dataDetailsMovement.value.findIndex(item => item.quantity === 0);

      if (indexEmptyQuantity !== -1) {
        errorMessageDetails.value = `The quantity is not greater than 0 in the ${indexEmptyQuantity + 1} line`;
        isShowErrorDetail.value = true;
      } else {
        Modal.confirm({
          title: 'Confirmation Required',
          icon: createVNode(ExclamationCircleOutlined),
          content: 'Are you sure you want to proceed? This action is irreversible.',
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
            await createNewMovement(dataDetailsMovement.value);
          }
        });

      }
    } else {
      // Show error notification
      notification.warning({
        message: 'Warning',
        description: "Can't create a movement with empty details!",
        class: 'custom-warning-notification'
      });
    }
  }
  //**************End of action pannier**************

  //******************Beginning of CRUD controller**************
  const getAllDataProductWithRemainingStock = async () => {
    try {
      loading.value = true;
      const response: Paginate<dataProductWithRemainingStock[]> = await getAllProductWithRemainingStockService(
          keyword.value,
          pageSize.value,
          currentPage.value,
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

  const createNewMovement = async (details: IDetails[]) => {
    try {
      loadingBtn.value = true;

      let data: IFormDetails[] = [];
      //Create a data dictionary
      details.forEach((item: IDetails) => {
        data.push({
          idProduct: item.product_id,
          isUnitPrice: item.is_unit_price,
          quantity: item.quantity,
        })
      })

      await createNewMovementService(
          true,
          data,
      );
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Operation Successful!',
        class: 'custom-success-notification'
      });

      loadingBtn.value = false;
      isOpenModalPannier.value = false;
      await localStorage.setItem('pannier', '[]');

      await navigateTo(RouteList.INVENTORY_SALES);
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

      loadingBtn.value = false;
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
    getAllDataProductWithRemainingStock();
  })
</script>

<template>
  <!-- Sort page, add btn, sort by category, search -->
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <!-- Page size -->
    <a-col class="mt-8" span="4">
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
      <span> entries per page</span>
    </a-col>
    <!-- Search input -->
    <a-col class="mt-8 flex justify-end" span="5">
      <a-input type="text" class="w-48" v-model:value="keyword" placeholder="Search"/>&nbsp;
      <a-button class="btn--primary" :icon="h(SearchOutlined)" @click="handleSearch"/>
    </a-col>
    <!-- Pannier -->
    <a-col class="mt-8">
      <a-badge :count="itemInPannier" show-zero @click="handleShowModalPannier">
        <ShoppingCartOutlined style="font-size: 32px;"/>
      </a-badge>
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
  <!--Pannier Modal-->
  <a-modal
      v-model:open="isOpenModalPannier"
      v-if="isOpenModalPannier"
      :maskClosable="false"
      :closable="false"
      :footer="null"
      style="top: 20px"
      width="1300px"
      title="Pannier"
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
              :scroll="{ x: 1200, y: 1000 }"
              bordered
          />
        </a-spin>
      </a-col>
    </a-row>
    <!-- Amount row -->
    <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="mt-8" span="24">
        <p style="font-size: 18px;">Total : {{ amountDetail }}</p>
      </a-col>
    </a-row>
    <!-- Action modal of details -->
    <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="mt-8" span="24">
        <a-button class="btn btn--default" size="middle" @click="handleCloseModalPannier">Cancel</a-button>
        <a-button
            class="btn btn--primary ml-4"
            html-type="submit"
            size="middle"
            :loading="loadingBtn"
            @click="handleSaveMovement"
        >Save</a-button>
        <span class="danger-color ml-5" style="font-size: 18px;" v-if="isShowErrorDetail">{{ errorMessageDetails }}</span>
      </a-col>
    </a-row>
  </a-modal>
</template>

<style scoped>

</style>