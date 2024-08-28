<script setup lang="ts">
  import {createVNode, h, type UnwrapRef} from 'vue';
  import {
    AButton,
    AInputNumber, ASelect,
    CheckOutlined,
    DeleteOutlined, ExclamationCircleOutlined, HistoryOutlined,
    InfoOutlined,
    PlusOutlined,
    SearchOutlined,
    StopOutlined,
  } from "#components";
  import type {SelectValue} from "ant-design-vue/es/select";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import type {Paginate} from "~/composables/apiResponse.interface";
  import {type FormInstance, Switch} from "ant-design-vue";
  import {STCodeList, type TStatus} from "~/composables/Status.interface";
  import type {
    IDetails,
    IFormDetails,
    IFormReject,
    IHistoryValidation,
    IMovement
  } from "~/composables/Inventory/Movement.interface";
  import {
    getAllDetailsMovementService, getAllHistoryValidationMovementService,
    getAllMovementService,
    updateDetailMovementService, validateOrRejectMovementService
  } from "~/composables/Inventory/movement.service";
  import {formatDateString} from "~/composables/helper";
  import type {SelectProps} from "ant-design-vue/lib";
  import type {IProductRemainingStock} from "~/composables/Product/Product.interface";
  import {getAllProductWithRemainingStockService} from "~/composables/Product/product.service";


  interface Props {
    activePage: TStatus;
  }


  const props = defineProps<Props>();
  const isAdmin = ref<string>(null);
  const loading = ref<boolean>(false);
  const loadingDetailsMovement = ref<boolean>(false);
  const loadingHistoryValidation = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSizeMovement = ref<number>(10);
  const currentPageMovement = ref<number>(1);
  const totalPageMovement = ref<number>(0);
  const dataMovement = ref<IMovement[]>([]);
  const dataDetailsMovement = ref<IDetails[]>([]);
  const dataProductWithRemainingStock = ref<IProductRemainingStock[]>([]);
  const dataHistoryValidation = ref<IHistoryValidation[]>([]);
  const isOpenModal = ref<boolean>(false);
  const isOpenModalReject = ref<boolean>(false);
  const isOpenModalHistoryValidation = ref<boolean>(false);
  const movementId = ref<string>('');
  const amountDetail = ref<string>('');
  const optionsProductDetails = ref<SelectProps['options']>([]);
  const isShowErrorDetail = ref<boolean>(false);
  const errorMessageDetails = ref<string>('');
  const formStateReject: UnwrapRef<IFormReject> = reactive({
    observation: '',
  });
  const formRef = ref<FormInstance>();

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
              [record.status.designation]
          )
          :
          (
              record.status.code === STCodeList.COMPLETED ?
              h('div',
                  {
                    style: { textAlign: 'center', color: 'white' },
                    class: 'primary-background-color'
                  },
                  [record.status.designation]
              ) :
              (
                  record.status.code === STCodeList.VALIDATED ?
                      h('div',
                          {
                            style: { textAlign: 'center', color: 'white' },
                            class: 'success-background-color'
                          },
                          [record.status.designation]
                      ) :
                      h('div',
                          {
                            style: { textAlign: 'center', color: 'white' },
                            class: 'danger-background-color'
                          },
                          [record.status.designation]
                      )
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
        class: 'btn--primary-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleViewHistoryValidationMovement(record)
      }, [h(HistoryOutlined)]),
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
        onClick: () => handleValidateMovement(record)
      }, [h(CheckOutlined)]),
      h('a-button', {
        class: 'btn--danger-outline btn-tab',
        size: 'large',
        onClick: () => handleRejectMovement(record)
      }, [h(StopOutlined)])
    ])
  };

  const deletedActionColumns = {
    title: 'Actions',
    key: 'actions',
    width: 200,
    customRender: ({ record }: { record: IMovement }) => h('div', [
      h('a-button', {
        class: 'btn--primary-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleViewHistoryValidationMovement(record)
      }, [h(HistoryOutlined)]),
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
      customRender: ({ record }: { record: IMovement}) => [record.isSales ? 'Sales' : 'Purchase'],
    },
    {
      title: 'CreatedAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      customRender: ({ record }: { record: IMovement}) => {
        const createdAt: string = formatDateString(record.createdAt);
        return h('div', {style: {textAlign: 'left'}}, [createdAt]);
      }
    },
    {
      title: 'UpdatedAt',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      customRender: ({ record }: { record: IMovement}) => {
        const updatedAt: string = formatDateString(record.updatedAt);
        return h('div', {style: {textAlign: 'left'}}, [updatedAt]);
      }
    },
    {
      title: 'Editor',
      key: 'editor',
      dataIndex: 'editor',
      customRender: ({ record }: { record: IMovement}) => [record.editor.firstName + ' ' + record.editor.lastName],
    },
    statusColumn,
    props.activePage === STCodeList.OUTSTANDING && localStorage.getItem('is_admin') === 'true' ?  activeActionsColumns : deletedActionColumns,
  ];

  const columnsDetailsMovement = [
    {
      title: 'Product',
      key: 'product',
      dataIndex: 'product_name',
      width: 200,
      customRender: ({ record }: { record: IDetails}) => [
          h(ASelect, {
            disabled: props.activePage === STCodeList.OUTSTANDING && isAdmin.value === 'false' || props.activePage === STCodeList.VALIDATED || props.activePage === STCodeList.COMPLETED || props.activePage === STCodeList.REJECTED && isAdmin.value === 'true',
            style:'width: 100%',
            'placeholder':'Select a product',
            'show-search': true,
            value: record.product_id,
            options: optionsProductDetails.value,
            'filter-option': filterOption,
            onSelect: (value) => {
              changeItemDetails(value, record);
            }
          })
      ]
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
          disabled: props.activePage === STCodeList.OUTSTANDING && isAdmin.value === 'false' || props.activePage === STCodeList.VALIDATED || props.activePage === STCodeList.COMPLETED || props.activePage === STCodeList.REJECTED && isAdmin.value === 'true',
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
          disabled: props.activePage === STCodeList.OUTSTANDING && isAdmin.value === 'false' || props.activePage === STCodeList.VALIDATED || props.activePage === STCodeList.COMPLETED || props.activePage === STCodeList.REJECTED && isAdmin.value === 'true',
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
              disabled: props.activePage === STCodeList.OUTSTANDING && isAdmin.value === 'false' || props.activePage === STCodeList.VALIDATED || props.activePage === STCodeList.COMPLETED || props.activePage === STCodeList.REJECTED && isAdmin.value === 'true',
              class: 'btn--danger-outline btn-tab',
              size: 'large',
              onClick: () => handleRemoveItemDetails(record)
            }, [h(DeleteOutlined)])
          ]
      )
    },
  ];

  const columnsHistoryValidation = [
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      customRender: ({ record }: { record: IHistoryValidation}) => {
        const createdAt: string = formatDateString(record.createdAt);
        return h('div', {style: {textAlign: 'left'}}, [createdAt]);
      }
    },
    {
      title: 'Validator',
      key: 'validator',
      dataIndex: 'validator',
      customRender: ({ record }: { record: IHistoryValidation}) => [record.validator ? record.validator.firstName + ' ' + record.validator.lastName : '---'],
    },
    {
      title: 'Observation',
      key: 'observation',
      dataIndex: 'observation',
      customRender: ({ record }: { record: IHistoryValidation}) => [record.observation ? record.observation : '---'],
    },
    statusColumn,
  ];

  //**********Reset all value and validator form*******
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  //************Add button action*********
  const handleAdd = () => {
    navigateTo(RouteList.INVENTORY_SALES_NEW);
  }


  //************Beginning of actions datatable button method**********
  const filterOption = (input: string, option: any) => {
    return option?.label?.toLowerCase().includes(input.toLowerCase());
  };

  const handleViewDetailsMovement = (record: IMovement) => {
    movementId.value = record.uuid;
    getAllDetailsMovement();
    getAllProductWithRemainingStock();
    handleShowModalDetails();
  };

  const handleViewHistoryValidationMovement = (record: IMovement) => {
    movementId.value = record.uuid;
    getAllHistoryMovement();
    handleShowModalHistoryValidation();
  };

  const changeItemDetails = (value: string, record: IDetails) => {
    const findSelectProductInDetails = dataDetailsMovement.value.find(item => item.product_id === value);

    if (findSelectProductInDetails) {
      notification.error({
        message: 'Error',
        description: 'Can not select a product already selected!',
        class: 'custom-error-notification'
      });

      record.product_id = '';
      record.product_name = '';
      record.quantity = 0;
      record.category_id = '';
      record.category_name = '';
      record.unit_id = '';
      record.unit_name = '';
      record.is_unit_price = true;
      record.product_sales_price_id = '';
      record.unit_price = 0;
      record.wholesale_price = 0;
      record.purchase_price = 0;
      record.remaining_stock = 0;
    } else {
      //find a product in dataProductWithRemainingStock to make an update of details item
      const findProduct = dataProductWithRemainingStock.value.find(product => product.product_id === value);

      if (findProduct) {
        record.product_id = findProduct.product_id;
        record.product_name = findProduct.product_id;
        record.quantity = 0;
        record.category_id = findProduct.category_id;
        record.category_name = findProduct.category_name;
        record.unit_id = findProduct.unit_id;
        record.unit_name = findProduct.unit_name;
        record.is_unit_price = true;
        record.product_sales_price_id = findProduct.product_sales_price_id;
        record.unit_price = findProduct.unit_price;
        record.wholesale_price = findProduct.wholesale_price;
        record.purchase_price = findProduct.purchase_price;
        record.remaining_stock = findProduct.remaining_stock;
      }
    }
  }

  const handleAddNewItemDetails = () => {
    //find in detail if a row is not completed, so we can't create a new row
    const findProduct = dataDetailsMovement.value.find(product => product.product_id === '');

    if (findProduct) {
      // Show error notification
      notification.error({
        message: 'Error',
        description: 'Impossible to add a new line if you have a line that does not yet have a product.',
        class: 'custom-error-notification'
      });
    } else {
      dataDetailsMovement.value.push({
        product_id: '',
        product_name: '',
        quantity: 0,
        category_id: '',
        category_name: '',
        unit_id: '',
        unit_name: '',
        is_unit_price: true,
        product_sales_price_id: '',
        unit_price: 0,
        wholesale_price: 0,
        purchase_price: 0,
        remaining_stock: 0,
      })
    }
  }

  const handleRemoveItemDetails = (record: IDetails) => {
    dataDetailsMovement.value = dataDetailsMovement.value.filter(item => item.product_id !== record.product_id);
    //We need to reload the amount of details
    getAmountDetails();
  };

  const handleValidateMovement = (record: IMovement) => {
    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loading.value = true;
        await validateOrRejectMovement(record.uuid, true, null);
        loading.value = false;
      }
    });
  };

  const handleRejectMovement = (record: IMovement) => {
    movementId.value = record.uuid;
    resetForm();
    formStateReject.observation = '';
    handleShowModalReject();
  };
  //************End of actions datatable button method**********

  //************Beginning of modal actions*********************
  const handleShowModalDetails = () => {
    isOpenModal.value = true;
  }

  const handleCloseModalDetails = () => {
    isOpenModal.value = false;
  }

  const handleShowModalHistoryValidation = () => {
    isOpenModalHistoryValidation.value = true;
  }

  const handleShowModalReject = () => {
    isOpenModalReject.value = true;
  }

  const handleCloseModalReject = () => {
    isOpenModalReject.value = false;
  }

  const handleSaveChangeDetails = () => {
    //Check if an item of the details contains empty product_id
    const indexEmptyProduct = dataDetailsMovement.value.findIndex(item => item.product_id === '' || item.quantity === 0);

    if (indexEmptyProduct !== -1) {
      errorMessageDetails.value = `You have not selected a product or the quantity is not greater than 0 in the ${indexEmptyProduct + 1} line`;
      isShowErrorDetail.value = true;
    } else {
      isShowErrorDetail.value = false;
      Modal.confirm({
        title: 'Confirmation Required',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Are you sure you want to proceed? This action is irreversible.',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          loadingBtn.value = true;
          await updateDetailsMovement();
        }
      });
    }
  }

  const onFinishReject = () => {
    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loadingBtn.value = true;
        await validateOrRejectMovement(movementId.value, false, formStateReject);
        loadingBtn.value = false;
        await handleCloseModalReject();
      }
    });
  }
  //************End of modal actions*********************

  //******************Beginning of CRUD controller**************

  const getAllDataMovement = async () => {
    try {
      loading.value = true;
      const response: Paginate<IMovement[]> = await getAllMovementService(
          true,
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
      dataDetailsMovement.value = await getAllDetailsMovementService(movementId.value);
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

  const getAllHistoryMovement = async () => {
    try {
      loadingHistoryValidation.value = true;
      dataHistoryValidation.value = await getAllHistoryValidationMovementService(movementId.value);
      loadingHistoryValidation.value = false;
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
      loadingHistoryValidation.value = false;
    }
  }

  const getAllProductWithRemainingStock = async () => {
    try {
      const response = await getAllProductWithRemainingStockService();
      //Keep all data
      dataProductWithRemainingStock.value = response.data;
      //Format data to the options of select product
      response.data.map((item: IProductRemainingStock) => {
        if (optionsProductDetails.value) {
          optionsProductDetails.value.push({ value: item.product_id, label: item.product_name });
        }
      });
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

  const updateDetailsMovement = async () => {
    try {
      let data: IFormDetails[] = [];
      //Create a data dictionary
      dataDetailsMovement.value.forEach((item: IDetails) => {
        data.push({
          idProduct: item.product_id,
          isUnitPrice: item.is_unit_price,
          quantity: item.quantity,
        })
      })

      await updateDetailMovementService(movementId.value, data);

      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Operation Successful!',
        class: 'custom-success-notification'
      });

      loadingBtn.value = false;

      handleCloseModalDetails();
      //Reload data movement
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

      loadingBtn.value = false;
    }
  }

  const validateOrRejectMovement = async (movementId: string, isValidate: boolean, observation: IFormReject | null) => {
    try {
      await validateOrRejectMovementService(movementId, isValidate, observation);
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Operation Successful!',
        class: 'custom-success-notification'
      });

      //Reload data movement
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
      loading.value = false;
    }
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
    isAdmin.value = localStorage.getItem('is_admin');
    getAllDataMovement();
  })
</script>

<template>
  <!--Filter datatable-->
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
  <!--Datatable-->
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
            v-if="isAdmin"
        />
      </a-spin>
    </a-col>
  </a-row>
  <!--Paginator datatable-->
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
  <!--Details Modal-->
  <a-modal
      v-model:open="isOpenModal"
      v-if="isOpenModal"
      closable
      :footer="null"
      style="top: 20px"
      @ok=""
      width="1300px"
  >
    <!-- Template title modal -->
    <template #title>
      <span>Movement details</span>
      <a-button
          class="btn--success ml-4"
          :icon="h(PlusOutlined)"
          @click="handleAddNewItemDetails"
          size="middle"
          v-if="props.activePage === 'OSD' && isAdmin === 'true' || props.activePage === 'RJT' && isAdmin !== 'true'"
      >
      </a-button>
    </template>
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
        <a-button class="btn btn--default" size="middle" @click="handleCloseModalDetails">Cancel</a-button>
        <a-button
            class="btn btn--primary ml-4"
            html-type="submit"
            size="middle"
            :loading="loadingBtn"
            @click="handleSaveChangeDetails"
            v-if="props.activePage === 'OSD' && isAdmin === 'true' || props.activePage === 'RJT' && isAdmin !== 'true'"
        >Save</a-button>
        <span class="danger-color ml-5" style="font-size: 18px;" v-if="isShowErrorDetail">{{ errorMessageDetails }}</span>
      </a-col>
    </a-row>
  </a-modal>
  <!--Reject Modal-->
  <a-modal
      v-model:open="isOpenModalReject"
      v-if="isOpenModalReject"
      closable
      :footer="null"
      style="top: 20px"
      @ok=""
      title="Reject movement"
  >
    <a-form
        :model="formStateReject"
        name="basic"
        autocomplete="off"
        @finish="onFinishReject"
        ref="formRef"
    >
      <a-form-item
          class="mt-5"
          label="Observation"
          name="observation"
          :rules="[{ required: true, message: 'Please input your observation!' }]"
      >
        <a-textarea v-model:value="formStateReject.observation" />
      </a-form-item>
      <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <a-col class="mt-8" span="24">
          <a-button class="btn btn--default" size="middle" @click="handleCloseModalReject">Cancel</a-button>
          <a-button
              class="btn btn--primary ml-4"
              html-type="submit"
              size="middle"
              :loading="loadingBtn"
          >Save</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
  <!--History validation Modal-->
  <a-modal
      v-model:open="isOpenModalHistoryValidation"
      v-if="isOpenModalHistoryValidation"
      closable
      :footer="null"
      style="top: 20px"
      @ok=""
      width="1000px"
  >
    <!-- Template title modal -->
    <template #title>
      <span>History validation</span>
    </template>
    <!--Datatable details movement-->
    <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="mt-8" span="24">
        <a-spin :spinning="loadingHistoryValidation" size="large">
          <a-table
              class="w-full"
              :columns="columnsHistoryValidation"
              :data-source="dataHistoryValidation"
              :pagination="false"
              :scroll="{ x: 800, y: 1000 }"
              bordered
          />
        </a-spin>
      </a-col>
    </a-row>
  </a-modal>
</template>

<style scoped>

</style>