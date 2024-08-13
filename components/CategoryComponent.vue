<script setup lang="ts">
import {createVNode, h} from 'vue';
import {
  DeleteOutlined,
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
import type {FormCategory, ICategory} from "~/composables/Category/Category.interface";
import {deleteCategoryService, getAllCategory, insertOrUpdateCategory} from "~/composables/Category/category.service";


interface Props {
    activePage: TStatus;
  }


  const props = defineProps<Props>();

  const statusColumn = {
    title: h('div', { style: { textAlign: 'center' } }, ['Status']),
    key: 'status',
    customRender: ({ record }: { record: ICategory}) => h('div', [
      record.status.code === STCodeList.ACTIVE ?
          h('div',
          {
              style: { textAlign: 'center', color: 'white' },
              class: 'primary-background-color'
            },
          ['Active']
          )
          : h('div',
              {
                style: { textAlign: 'center', color: 'white' },
                class: 'danger-background-color'
              },
              ['Deleted']
          ),
    ])
  }

  const actifActionsColumns = {
    title: 'Actions',
    key: 'actions',
    width: 200,
    customRender: ({ record }: { record: ICategory }) => h('div', [
      h('a-button', {
        class: 'btn--info-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleView(record)
      }, [h(EyeOutlined)]),
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
    customRender: ({ record }: { record: ICategory }) => h('div', [
      h('a-button', {
        class: 'btn--info-outline btn-tab',
        size: 'large',
        style: { marginRight: '8px' },
        onClick: () => handleView(record)
      }, [h(EyeOutlined)]),
    ])
  };

  const columns = [
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    statusColumn,
    props.activePage === STCodeList.ACTIVE ?  actifActionsColumns : deletedActionColumns,
  ];

  const loading = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSize = ref<number>(10);
  const currentPage = ref<number>(1);
  const totalPage = ref<number>(0);
  const data = ref<ICategory[]>([]);
  const isOpenModal = ref<boolean>(false);
  const isEdit = ref<boolean>(false);
  const isView = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const categoryId = ref<string>('');
  const formState = reactive<FormCategory>({designation: ''});

  //**********Reset all value and validator form*******
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  //************Beginning of modal actions*********************
  const handleShowModal = (isEditMode: boolean, isViewMode: boolean) => {
    isEdit.value = isEditMode;
    isView.value = isViewMode;
    isOpenModal.value = true;
  }

  const handleCloseModal = () => {
    resetForm();
    isOpenModal.value = false;
  }
  //************End of modal actions*********************

  //************Add user button action*********
  const handleAddCategory = () => {
    resetForm();
    formState.designation = '';
    handleShowModal(false, false);
  }


  //************Beginning of actions datatable button method**********
  const handleView = (record: ICategory) => {
    resetForm();
    formState.designation = record.designation;

    handleShowModal(false, true);
  };

  const handleEdit = (record: ICategory) => {
    resetForm();
    formState.designation = record.designation;

    if (record.uuid != null) {
      categoryId.value = record.uuid;
    }

    handleShowModal(true, false);
  };

  const handleDelete = (record: ICategory) => {
    if (record.uuid != null) {
      categoryId.value = record.uuid;
    }

    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loadingBtn.value = true;
        await deleteCategory();
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
          await updateCategory();
        } else {
          await insertCategory();
        }
      }
    });
  };

  //******************Beginning of CRUD controller**************
  const insertCategory = async () => {
    const dataForm: FormCategory = formState;

    try {
      //the params userId is null here because we are in the insert method
      await insertOrUpdateCategory(dataForm, null, 'POST');
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
      await getAllDataCategory();
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

  const updateCategory = async () => {
    const dataForm: FormCategory = {
      designation: formState.designation,
    };

    try {
      //Call operation API in service
      await insertOrUpdateCategory(dataForm, categoryId.value, 'PATCH');
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
      await getAllDataCategory();
    } catch (error) {
      //Verification code status if equal 401 then we redirect to login
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

  const deleteCategory = async () => {

    try {
      //Call operation API in service
      await deleteCategoryService(categoryId.value);
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
      await getAllDataCategory();
    } catch (error) {
      //Verification code status if equal 401 then we redirect to login
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
      loading.value = true;
      const response: Paginate<ICategory[]> = await getAllCategory(
          keyword.value,
          pageSize.value,
          currentPage.value,
          props.activePage);
      data.value = response.data;
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
  //******************End of CRUD controller********************

  //******************Beginning of filter and paginator methods****
  const handleClickPaginator = () => {
    getAllDataCategory();
  };

  const handleChangePageSize = (value: SelectValue) => {
    pageSize.value = Number(value);
    currentPage.value = 1;
    getAllDataCategory();
  };

  const handleSearch = () => {
    currentPage.value = 1;
    getAllDataCategory();
  }
  //******************End filter of and paginator methods****


  onMounted(() => {
    getAllDataCategory();
  })
</script>

<template>
  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
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
    <a-col class="mt-8" span="7">
      <a-button :icon="h(PlusOutlined)" @click="handleAddCategory" v-if="props.activePage === STCodeList.ACTIVE" class="btn--success ml-5">Add new</a-button>
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
            :columns="columns"
            :data-source="data"
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
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="totalPage"
          @prevClick="handleClickPaginator"
          @change="handleClickPaginator"
          @nextClick="handleClickPaginator"
          :showSizeChanger="false" />
    </a-col>
  </a-row>
  <a-modal
      v-model:open="isOpenModal"
      closable
      :footer="null"
      title="Category"
      style="top: 20px"
      @ok=""
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
</template>

<style scoped>

</style>