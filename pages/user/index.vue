<script setup lang="ts">
import {createVNode, h} from 'vue';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined
} from "#components";
  import type {FormStateUser, IUser} from "~/composables/User/User.interface";
  import type {SelectValue} from "ant-design-vue/es/select";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import {getAllUser, getOneUser, insertOrUpdateUser} from "~/composables/User/user.service";
  import type {Paginate} from "~/composables/apiResponse.interface";
  import type {FormInstance} from "ant-design-vue";

  definePageMeta({
    layout: 'navbar',
    title: 'Users',
    middleware: ['user-middleware', 'admin-middleware']
  });

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 150,
      customRender: ({ text }: { text: boolean }) => text ? 'Admin' : 'Sale Manager'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      customRender: ({ record }: { record: IUser }) => h('div', [
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
    }
  ];

  const loading = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSize = ref<number>(10);
  const currentPage = ref<number>(1);
  const totalPage = ref<number>(0);
  const status = ref<'ACT' | 'DLT'>('ACT');
  const data = ref<IUser[]>([]);
  const isOpenModal = ref<boolean>(false);
  const isEdit = ref<boolean>(false);
  const isView = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const formState = reactive<FormStateUser>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false
  });

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  const handleShowModal = (isEditMode: boolean, isViewMode: boolean) => {
    isEdit.value = isEditMode;
    isView.value = isViewMode;
    isOpenModal.value = true;
  }

  const handleAddUser = () => {
    resetForm();
    handleShowModal(false, false);
  }

  const handleCloseModal = () => {
    resetForm();
    isOpenModal.value = false;
  }

const onSubmitForm = async () => {
  Modal.confirm({
    title: 'Confirmation Required',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Are you sure you want to proceed? This action is irreversible.',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      loadingBtn.value = true;
      await insertUser();
    }
  });
};

const insertUser = async () => {
  const dataForm: FormStateUser = formState;

  try {
    //the params userId is null here because we are in the insert method
    await insertOrUpdateUser(dataForm, null, 'POST');
    loadingBtn.value = false;
    isOpenModal.value = false;

    // Show success notification
    notification.success({
      message: 'Success',
      description: 'Operation Successful!',
      class: 'custom-success-notification'
    });

    //reload data
    await getAllDataUser();
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


  const getAllDataUser = async () => {
    try {
      loading.value = true;
      const response: Paginate<IUser[]> = await getAllUser(keyword.value, pageSize.value, currentPage.value, status.value);
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

  const handleClickPaginator = () => {
    getAllDataUser();
  };

  const handleChangePageSize = (value: SelectValue) => {
    pageSize.value = Number(value);
    currentPage.value = 1;
    getAllDataUser();
  };

  const handleSearch = () => {
    currentPage.value = 1;
    getAllDataUser();
  }

  // Define the methods for button actions
  const handleView = (record: IUser) => {
    resetForm();
    formState.firstName = record.firstName;
    formState.lastName = record.lastName;
    formState.email = record.email;
    formState.phone = record.phone;
    formState.isAdmin = record.isAdmin;

    handleShowModal(false, true);
  };

  const handleEdit = (record: IUser) => {
    message.info(`Editing details of ${record.firstName} ${record.lastName}`);
  };

  const handleDelete = (record: IUser) => {
    message.warn(`Deleting ${record.firstName} ${record.lastName}`);
  };

  onMounted(() => {
    getAllDataUser();
  })
</script>

<template>
  <Title>User</Title>
  <a-row>
    <a-col span="24" class="flex justify-start" >
      <user-outlined style="font-size: 20px;"/>
      <ATypographyTitle class="mt-3 ml-2" style="font-size: 20px;">User</ATypographyTitle>
    </a-col>
  </a-row>

  <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
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
    <a-col class="mt-8" span="8">
      <a-button :icon="h(PlusOutlined)" @click="handleAddUser" class="btn--success ml-5">Add new</a-button>
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
      title="User"
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
              name="email"
              type="email"
              :rules="[{ required: true, type: 'email', message: 'The input is not a valid email format!' }]"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_email"><span class="required_toil">*</span> Email:</label></a-col>
              <a-col span="19">
                <a-input v-model:value="formState.email" size="large" placeholder="E-mail"></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="firstName"
              type="text"
              :rules="[{ required: true, message: 'Please input your First Name!' }]"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_firstName"><span class="required_toil">*</span> First Name:</label></a-col>
              <a-col span="19">
                <a-input v-model:value="formState.firstName" size="large" placeholder="First Name"></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="lastName"
              type="text"
              :rules="[{ required: true, message: 'Please input your Last Name!' }]"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_lastName"><span class="required_toil">*</span> Last Name:</label></a-col>
              <a-col span="19">
                <a-input v-model:value="formState.lastName" size="large" placeholder="Last Name"></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="phone"
              type="text"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_phone">Phone number: </label></a-col>
              <a-col span="19">
                <a-input v-model:value="formState.phone" size="large" placeholder="Phone number"></a-input>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="isAdmin"
              type="text"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_isAdmin">Role:</label></a-col>
              <a-col span="19">
                <a-switch v-model:checked="formState.isAdmin" checked-children="Admin" un-checked-children="Manager" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="password"
              type="text"
              v-if="isEdit === false && isView === false"
              :rules="[{ required: true, message: 'Please input the password for this new user!' }]"
              class="w-full mt-10 mb-10"
          >
            <a-row>
              <a-col span="5"><label for="basic_password"><span class="required_toil">*</span> Password:</label></a-col>
              <a-col span="19">
                <a-input-password v-model:value="formState.password" size="large" placeholder="Password"/>
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
