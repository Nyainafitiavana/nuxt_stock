<script setup lang="ts">
import {createVNode, h} from 'vue';
import {
  DeleteOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
} from "#components";
import type {SelectValue} from "ant-design-vue/es/select";
import {handleInAuthorizedError} from "~/composables/CustomError";
import type {Paginate} from "~/composables/apiResponse.interface";
import type {FormInstance} from "ant-design-vue";
import {STCodeList, type TStatus} from "~/composables/Status.interface";
import type {ICategory} from "~/composables/Category/Category.interface";
import {getAllCategory} from "~/composables/Category/category.service";
import type {FormProduct, IProduct} from "~/composables/Product/Product.interface";
import type {FormProductSalesPrice, IProductSalesPrice} from "~/composables/Product/ProductSalesPrice.interface";
import {
  deleteProductService, getAllDataProductSalesPriceService,
  getAllDataProductService, insertNewProductSalePrice,
  insertOrUpdateProduct
} from "~/composables/Product/product.service";
import type {SelectProps} from "ant-design-vue/lib";
import type {RuleObject} from "ant-design-vue/es/form";
import {formatDateString} from "~/composables/helper";
import type {IUnit} from "~/composables/Unit/Unit.interface";
import {getAllUnit} from "~/composables/Unit/unit.service";


interface Props {
    activePage: TStatus;
}


  const props = defineProps<Props>();

  //**************Beginning of Column datatable property***********
  const standardSalesPrice = {
    title: 'Standard unit price',
    key: 'productSalesPrice',
    dataIndex: ['productSalesPrice', 'unitPrice'],
    customRender: ({ record }: { record: IProduct}) => {
      let value = '---';

      if (record.productSalesPrice.length > 0) {
        record.productSalesPrice.map((item: IProductSalesPrice) => {
          if (item.status.code === STCodeList.ACTIVE) {
            value = new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(item.unitPrice);
          }
        })
      }

      return h('div', { style: { textAlign: 'right' } }, [value]);
    }
  }

  const wholeSalesPrice = {
  title: 'Wholesale unit price',
  key: 'productSalesPrice',
  dataIndex: ['productSalesPrice', 'wholesale'],
  customRender: ({ record }: { record: IProduct}) => {
    let value = '---';

    if (record.productSalesPrice.length > 0) {
      record.productSalesPrice.map((item: IProductSalesPrice) => {
        if (item.status.code === STCodeList.ACTIVE) {
          value = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(item.wholesale);
        }
      })
    }

    return h('div', { style: { textAlign: 'right' } }, [value]);
  }
}

  const statusColumn = {
    title: h('div', { style: { textAlign: 'center' } }, ['Status']),
    key: 'status',
    dataIndex: 'status',
    customRender: ({ record }: { record: ICategory}) => h('div', [
      record.status.code === STCodeList.ACTIVE ?
          h('div',
          {
              style: { textAlign: 'center', color: 'white' },
              class: 'primary-background-color'
            },
          ['Active']
          )
          : (record.status.code === STCodeList.DELETED ? h('div',
              {
                style: { textAlign: 'center', color: 'white' },
                class: 'danger-background-color'
              },
              ['Deleted']
          ):
          h('div',
              {
                style: { textAlign: 'center', color: 'white' },
                class: 'secondary-background-color'
              },
              ['Old']
          )
        ),
    ])
  }

  const activeActionsColumns = {
    title: 'Actions',
    key: 'actions',
    width: 200,
    customRender: ({ record }: { record: IProduct }) => h('div', [
      h('a-button', {
        class: 'btn--info-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleView(record)
      }, [h(EyeOutlined)]),
      h('a-button', {
        class: 'btn--warning-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleShowProductSalesPrice(record)
      }, [h(DollarCircleOutlined)]),
      h('a-button', {
        class: 'btn--primary-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleEdit(record)
      }, [h(FormOutlined)]),
      h('a-button', {
        class: 'btn--danger-outline btn-tab',
        size: 'large',
        onClick: () => handleDelete(record)
      }, [h(DeleteOutlined)])
    ])
  };

  const deletedActionColumns = {
    title: 'Actions',
    key: 'actions',
    width: 200,
    customRender: ({ record }: { record: IProduct }) => h('div', [
      h('a-button', {
        class: 'btn--info-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleView(record)
      }, [h(EyeOutlined)]),
      h('a-button', {
        class: 'btn--warning-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleShowProductSalesPrice(record)
      }, [h(DollarCircleOutlined)]),
    ])
  };

  const columns = [
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'designation'],
      key: 'unit',
      customRender: ({ text }: { text: string }) => text ? text : '---'
    },
    {
      title: 'Category',
      dataIndex: ['category', 'designation'],
      key: 'category',
      customRender: ({ text }: { text: string }) => text ? text : '---'
    },
    standardSalesPrice,
    wholeSalesPrice,
    statusColumn,
    props.activePage === STCodeList.ACTIVE ?  activeActionsColumns : deletedActionColumns,
  ];

  //Columns for product sales price datatable
  const columnsSalesPrice = [
    {
      title: 'Standard U.price',
      key: 'unitPrice',
      dataIndex: 'unitPrice',
      customRender: ({ record }: { record: IProductSalesPrice}) => {
        const value = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.unitPrice);

        return h('div', {style: {textAlign: 'right'}}, [value]);
      }
    },
    {
      title: 'Wholesale U.price',
      key: 'wholesale',
      dataIndex: 'unitPrice',
      customRender: ({ record }: { record: IProductSalesPrice}) => {
        const value = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(record.wholesale);

        return h('div', {style: {textAlign: 'right'}}, [value]);
      }
    },
    {
      title: 'CreatedAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      customRender: ({ record }: { record: IProductSalesPrice}) => {
        const createdAd: string = formatDateString(record.createdAt);
        return h('div', {style: {textAlign: 'right'}}, [createdAd]);
      }
    },
    statusColumn,
  ];
  //**************End of Column datatable property***********

  //**************Beginning of state management**************
  const loading = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const loadingBtnSalesPrice = ref<boolean>(false);
  const loadingCategoryFilterList = ref<boolean>(false);
  const loadingUnitFilterList = ref<boolean>(false);
  const loadingSalesPrice = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSize = ref<number>(10);
  const currentPage = ref<number>(1);
  const totalPage = ref<number>(0);
  const pageSizeSalesPrice = ref<number>(10);
  const currentPageSalesPrice = ref<number>(1);
  const totalPageSalesPrice = ref<number>(0);
  const dataProduct = ref<IProduct[]>([]);
  const dataProductSalesPrice = ref<IProductSalesPrice[]>([]);
  const isOpenModal = ref<boolean>(false);
  const isOpenModalSalesPrice = ref<boolean>(false);
  const isShowFormAddProductSalePrice = ref<boolean>(false);
  const isEdit = ref<boolean>(false);
  const isView = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const productId = ref<string>('');
  const currentProductDesignation = ref<string>('');
  const formState = reactive<FormProduct>(
      {
        designation: '',
        description: '',
        idCategory: '',
        idUnit: '',
      }
  );
const formStateSalesPrice = reactive<FormProductSalesPrice>(
    {
      idProduct: '',
      unitPrice: 0,
      wholesale: 0,
    }
);
  const optionsCategory = ref<SelectProps['options']>([{ value: '', label: 'All'}]);
  const currentCategoryList = ref<string>('');
  const optionsUnit = ref<SelectProps['options']>([{ value: '', label: 'All'}]);
  const currentUnitList = ref<string>('');
  //**************End of state management**************

  //***********Beginning of select method of category product***************
  const filterOption = (input: string, option: any) => {
    return option?.label?.toLowerCase().includes(input.toLowerCase());
  };

  const handleChangeFilterCategoryInList = () => {
    getAllDataProduct();
  };

  const handleChangeFilterUnitInList = () => {
    getAllDataUnit();
  };
  //***********End of select method of category product***************

  //**********Reset all value and validator form*******
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  //************Beginning of modal actions*********************
  //************Beginning of modal add, view, edit actions*********************
  const handleShowModal = (isEditMode: boolean, isViewMode: boolean) => {
    isEdit.value = isEditMode;
    isView.value = isViewMode;
    isOpenModal.value = true;
  }

  const handleCloseModal = () => {
    resetForm();
    isOpenModal.value = false;
  }
  //************End of modal add, view, edit actions*********************

  //************Beginning of sales price modal actions*********************
  const handleShowModalProductSalesPrice = () => {
    isOpenModalSalesPrice.value = true;
  }

  const handleCloseModalSalesPrice = () => {
    isOpenModalSalesPrice.value = false;
  }
  //************End of sales price modal actions*********************

  //*************Beginning of product sales price form methods**********
  const handleShowFormAddProductSalesPrice = () => {
    //Rest validator and value of sales price form
    resetForm();
    formStateSalesPrice.unitPrice = 0;
    formStateSalesPrice.wholesale = 0;

    isShowFormAddProductSalePrice.value = true;
  }

  const handleCancelAddProductSalesPrice = () => {
    isShowFormAddProductSalePrice.value = false;
  }

  const validatePrice = (rule: RuleObject, value: number, callback: any) => {
    if (value > 0) {
      callback();
    } else {
      callback(new Error('The price must be greater than 0'));
    }
  }
  //*************Beginning of product sales price form methods**********
  //************End of modal actions*********************

  //************Add user button action*********
  const handleAdd = () => {
    //Reset validator and value of form before show modal
    resetForm();
    formState.designation = '';
    formState.description = '';
    formState.idCategory = '';
    formState.idUnit = '';
    handleShowModal(false, false);
  }


  //************Beginning of actions datatable button method**********
  const handleView = (record: IProduct) => {
    resetForm();
    formState.designation = record.designation;
    formState.description = record.description;
    formState.idCategory = record.category.uuid;
    formState.idUnit = record.unit.uuid;

    handleShowModal(false, true);
  };

  const handleShowProductSalesPrice = (record: IProduct) => {
    //Reset validator
    resetForm();
    //Set current idProduct
    formStateSalesPrice.idProduct = record.uuid;
    //Set current designation product
    currentProductDesignation.value = record.designation;
    //Reset value of form product sales price
    formStateSalesPrice.unitPrice = 0;
    formStateSalesPrice.wholesale = 0;

    //Get All data product sales price
    getAllDataProductSalesPrice();

    handleShowModalProductSalesPrice();
  };

  const handleEdit = (record: IProduct) => {
    //Reset validator
    resetForm();
    //Set value formState with current index of product
    formState.designation = record.designation;
    formState.description = record.description;
    formState.idCategory = record.category.uuid;
    formState.idUnit = record.unit.uuid;
    productId.value = record.uuid;

    handleShowModal(true, false);
  };

  const handleDelete = (record: IProduct) => {
    //Set productId with current record
    productId.value = record.uuid;
    //Show confirm popup
    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loadingBtn.value = true;
        await deleteProduct();
      }
    });
  };
  //************End of actions datatable button method**********

  //*******Global method on submit user form********************
  const onSubmitForm = async () => {
    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loadingBtn.value = true;

        if (isEdit.value) {
          await updateProduct();
        } else {
          await insertProduct();
        }
      }
    });
  };

//*******Method on submit product sales price form********************
  const onSubmitFormProductSalesPrice = async () => {
    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loadingBtnSalesPrice.value = true;
        await insertProductSalesPrice();
      }
    });
  };

  //******************Beginning of CRUD controller**************
  const insertProduct = async () => {
    const dataForm: FormProduct = formState;

    try {
      //the params userId is null here because we are in the insert method
      await insertOrUpdateProduct(dataForm, null, 'POST');
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
      await getAllDataProduct();
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

  const insertProductSalesPrice = async () => {
    const dataForm: FormProductSalesPrice = formStateSalesPrice;

    try {
      //the params userId is null here because we are in the insert method
      await insertNewProductSalePrice(dataForm);
      //turn off of loading button and close modal
      loadingBtnSalesPrice.value = false;

      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Operation Successful!',
        class: 'custom-success-notification'
      });

      //Close form add product sales price
      handleCancelAddProductSalesPrice();
      //reload data product sales price
      await getAllDataProductSalesPrice();
      //reload data product
      await getAllDataProduct();
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

  const updateProduct = async () => {
    const dataForm: FormProduct = formState;

    try {
      //Call operation API in service
      await insertOrUpdateProduct(dataForm, productId.value, 'PATCH');
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
      await getAllDataProduct();
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

  const deleteProduct = async () => {

    try {
      //Call operation API in service
      await deleteProductService(productId.value);
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
      await getAllDataProduct();
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

  const getAllDataProduct = async () => {
    try {
      loading.value = true;
      const response: Paginate<IProduct[]> = await getAllDataProductService(
          keyword.value,
          pageSize.value,
          currentPage.value,
          props.activePage,
          currentCategoryList.value
      );
      dataProduct.value = response.data;
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

  const getAllDataProductSalesPrice = async () => {
    try {
      loadingSalesPrice.value = true;
      const response: Paginate<IProductSalesPrice[]> = await getAllDataProductSalesPriceService(
          pageSizeSalesPrice.value,
          currentPageSalesPrice.value,
          formStateSalesPrice.idProduct
      );
      dataProductSalesPrice.value = response.data;
      totalPageSalesPrice.value = response.totalRows;
      loadingSalesPrice.value = false;
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
  //******************End of CRUD controller********************

  //******************Beginning of filter and paginator methods****
  const handleClickPaginator = () => {
    getAllDataProduct();
  };

  const handleClickPaginatorSalesPrice = () => {
    getAllDataProductSalesPrice();
  };

  const handleChangePageSize = (value: SelectValue) => {
    pageSize.value = Number(value);
    currentPage.value = 1;
    getAllDataProduct();
  };

  const handleSearch = () => {
    currentPage.value = 1;
    getAllDataProduct();
  }
  //******************End filter of and paginator methods****


  onMounted(() => {
    getAllDataProduct();
    getAllDataCategory();
    getAllDataUnit();
  })
</script>

<template>
  <!-- Sort page, add btn, sort by category, search -->
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <!-- Page size -->
    <a-col class="mt-8" span="5">
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
    <!-- Add btn -->
    <a-col class="mt-8" span="3">
      <a-button :icon="h(PlusOutlined)" @click="handleAdd" v-if="props.activePage === STCodeList.ACTIVE" class="btn--success ml-5">Add</a-button>
    </a-col>
    <!-- Sort by category -->
    <a-col class="mt-8" span="8">
      <span>Sort by category : </span>
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
    <!-- Search input -->
    <a-col class="mt-8 flex justify-end" span="8">
      <a-input type="text" class="w-48" v-model:value="keyword" placeholder="Search"/>&nbsp;
      <a-button class="btn--primary" :icon="h(SearchOutlined)" @click="handleSearch"/>
    </a-col>
  </a-row>
  <!-- Datatable -->
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <a-col class="mt-8" span="24">
      <a-spin :spinning="loading" size="large">
        <a-table
            class="w-full"
            :columns="columns"
            :data-source="dataProduct"
            :pagination="false"
            :scroll="{ x: 1000, y: 1000 }"
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
  <!-- Modal for add, view or edit -->
  <a-modal
      v-model:open="isOpenModal"
      closable
      :footer="null"
      title="Product"
      style="top: 20px"
      @ok=""
      v-if="isOpenModal"
  >
    <a-row class="w-full">
      <a-col class="w-full">
        <a-form
            ref="formRef"
            :model="formState"
            name="basic"
            layout="inline"
            autocomplete="off"
            @finish="onSubmitForm"
        >
          <a-form-item
              name="designation"
              type="text"
              :rules="[{ required: true, message: 'Please input the designation of the new category!' }]"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_designation"><span class="required_toil">*</span> Designation:</label></a-col>
              <a-col span="19">
                <a-input v-model:value="formState.designation" size="large" placeholder="Designation" :disabled="isView"></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="idUnit"
              type="select"
              :rules="[{ required: true, message: 'Please the unit of this product!' }]"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_idUnit"><span class="required_toil">*</span> Unit:</label></a-col>
              <a-col span="19">
                <a-select
                    class="w-44"
                    v-model:value="formState.idUnit"
                    show-search
                    :options="optionsUnit"
                    :filter-option="filterOption"
                    :disabled="isView"
                    :loading="loadingUnitFilterList"
                ></a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="idCategory"
              type="select"
              :rules="[{ required: true, message: 'Please the category of this product!' }]"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_idCategory"><span class="required_toil">*</span> Category:</label></a-col>
              <a-col span="19">
                <a-select
                    class="w-44"
                    v-model:value="formState.idCategory"
                    show-search
                    :options="optionsCategory"
                    :filter-option="filterOption"
                    :disabled="isView"
                    :loading="loadingCategoryFilterList"
                ></a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="description"
              type="text"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="24">
                <a-textarea v-model:value="formState.description" placeholder="You can write an description here." allow-clear :disabled="isView"/>
              </a-col>
            </a-row>
          </a-form-item>
          <a-row class="mt-10">
            <a-form-item class="w-full flex justify-start">
              <a-button class="btn btn--default" size="large" @click="handleCloseModal">Cancel</a-button>
              <a-button
                  v-if="!isView"
                  class="btn btn--primary ml-4"
                  html-type="submit"
                  size="large"
                  :loading="loading"
              >Save</a-button>
            </a-form-item>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
  </a-modal>
  <!-- Modal for product sales prices -->
  <a-modal
      v-model:open="isOpenModalSalesPrice"
      closable
      :footer="null"
      style="top: 20px"
      @ok=""
      v-if="isOpenModalSalesPrice"
      width="1000px"
  >
    <!-- Template title modal -->
    <template #title>
      <span>Sales price of : {{ currentProductDesignation }}</span>
      <a-button
          v-if="props.activePage === STCodeList.ACTIVE"
          class="btn--success ml-4"
          :icon="h(PlusOutlined)"
          @click="handleShowFormAddProductSalesPrice"
          size="middle"
      >
      </a-button>
    </template>
    <!-- Form to add a new product sales price -->
    <a-row v-if="isShowFormAddProductSalePrice" class="w-full">
      <a-col class="w-full">
        <a-form
            ref="formRef"
            :model="formStateSalesPrice"
            name="basic"
            layout="inline"
            autocomplete="off"
            @finish="onSubmitFormProductSalesPrice"
        >
          <!-- Form items -->
          <a-row>
            <a-col span="11">
              <a-form-item
                  name="unitPrice"
                  type="text"
                  :rules="[
                      { required: true, message: 'Please input the standard unit price !' },
                      { validator: validatePrice, trigger: 'change' }
                  ]"
                  class="w-full mt-10"
              >
                <a-row>
                  <a-col span="24"><label for="basic_unitPrice"><span class="required_toil">*</span> Standard unit price:</label></a-col>
                  <a-col span="24">
                    <a-input-number v-model:value="formStateSalesPrice.unitPrice" :min="0">
                      <template #addonAfter><SettingOutlined /></template>
                    </a-input-number>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>&emsp;
            <a-col span="11">
              <a-form-item
                  name="wholesale"
                  type="text"
                  class="w-full mt-10"
              >
                <a-row>
                  <a-col span="24"><label for="basic_wholesale"><span class="required_toil"></span> Wholesale unit price:</label></a-col>
                  <a-col span="24">
                    <a-input-number v-model:value="formStateSalesPrice.wholesale" :min="1">
                      <template #addonAfter><SettingOutlined /></template>
                    </a-input-number>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- Form actions btn -->
          <a-row class="mt-10">
            <a-form-item class="w-full flex justify-start">
              <a-button class="btn btn--default" size="middle" @click="handleCancelAddProductSalesPrice">Cancel</a-button>
              <a-button
                  v-if="!isView"
                  class="btn btn--primary ml-4"
                  html-type="submit"
                  size="middle"
                  :loading="loadingBtnSalesPrice"
              >Save</a-button>
            </a-form-item>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <!-- Datatable product sales price -->
    <a-row class="mt-8">
      <a-col span="24">
        <a-spin :spinning="loadingSalesPrice" size="large">
          <a-table
              :columns="columnsSalesPrice"
              :data-source="dataProductSalesPrice"
              :pagination="false"
              bordered
          />
        </a-spin>
      </a-col>
    </a-row>
    <!-- Pagination -->
    <a-row>
      <a-col class="mt-8 flex justify-end" span="24">
        <a-pagination
            v-model:current="currentPageSalesPrice"
            v-model:pageSize="pageSizeSalesPrice"
            :total="totalPageSalesPrice"
            @prevClick="handleClickPaginatorSalesPrice"
            @change="handleClickPaginatorSalesPrice"
            @nextClick="handleClickPaginatorSalesPrice"
            :showSizeChanger="true"
        />
      </a-col>
    </a-row>
    <!-- Btn close modal -->
    <a-row class="mt-10">
      <a-col span="24">
        <a-button class="btn btn--secondary-outline w-full" size="middle" @click="handleCloseModalSalesPrice">Close</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>

<style scoped>

</style>