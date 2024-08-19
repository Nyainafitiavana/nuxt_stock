<script setup lang="ts">
  import {createVNode, h} from 'vue';
  import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    FormOutlined,
    PlusOutlined,
    SearchOutlined, TeamOutlined, UserOutlined
  } from "#components";
  import type {FormStateUser, IUser} from "~/composables/User/User.interface";
  import type {SelectValue} from "ant-design-vue/es/select";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import {deleteUserService, getAllUser, insertOrUpdateUser} from "~/composables/User/user.service";
  import type {Paginate} from "~/composables/apiResponse.interface";
  import type {FormInstance} from "ant-design-vue";
  import {STCodeList, type TStatus} from "~/composables/Status.interface";


  interface Props {
    activePage: TStatus;
  }


  const props = defineProps<Props>();

  const statusColumn = {
    title: h('div', { style: { textAlign: 'center' } }, ['Status']),
    key: 'status',
    customRender: ({ record }: { record: IUser}) => h('div', [
      record.status && (record.status.code === STCodeList.ACTIVE) ?
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

  const activeActionsColumns = {
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
  };

  const deletedActionColumns = {
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
    ])
  };

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
      customRender: ({ text }: { text: string }) => text ? text : '---'
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 150,
      customRender: ({ text }: { text: boolean }) => text ?
          h(
              'div',
              { class : 'flex' },
              [
                h(
                    'div',
                    {
                      class : 'success-color',
                      style: 'font-size: 20px;'
                    },
                    [h(UserOutlined)]
                ),
                h(
                    'div',
                    {
                      class : 'success-secondary mt-3 ml-1',
                      style: 'font-size: 15px;'
                    },
                    ['Admin']
                )
              ]
          ) :
          h(
              'div',
              { class : 'flex' },
              [
                h(
                    'div',
                    {
                      class : 'warning-color',
                      style: 'font-size: 20px;'
                    },
                    [h(TeamOutlined)]
                ),
                h(
                    'div',
                    {
                      class : 'success-secondary mt-3 ml-1',
                      style: 'font-size: 15px;'
                    },
                    ['Manager']
                )
              ]
          )
    },
    statusColumn,
    props.activePage === STCodeList.ACTIVE ?  activeActionsColumns : deletedActionColumns,
  ];

  const loading = ref<boolean>(false);
  const loadingBtn = ref<boolean>(false);
  const keyword = ref<string>('');
  const pageSize = ref<number>(10);
  const currentPage = ref<number>(1);
  const totalPage = ref<number>(0);
  const data = ref<IUser[]>([]);
  const isOpenModal = ref<boolean>(false);
  const isEdit = ref<boolean>(false);
  const isView = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const userId = ref<string>('');
  const formState = reactive<FormStateUser>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false
  });

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
  const handleAddUser = () => {
    resetForm();
    formState.firstName = '';
    formState.lastName = '';
    formState.email = '';
    formState.phone = '';
    formState.isAdmin = false;
    handleShowModal(false, false);
  }


  //************Beginning of actions datatable button method**********
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
    resetForm();
    formState.firstName = record.firstName;
    formState.lastName = record.lastName;
    formState.email = record.email;
    formState.phone = record.phone;
    formState.isAdmin = record.isAdmin;

    if (record.uuid != null) {
      userId.value = record.uuid;
    }

    handleShowModal(true, false);
  };

  const handleDelete = (record: IUser) => {
    if (record.uuid != null) {
      userId.value = record.uuid;
    }

    Modal.confirm({
      title: 'Confirmation Required',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Are you sure you want to proceed? This action is irreversible.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        loadingBtn.value = true;
        await deleteUser();
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
          await updateUser();
        } else {
          await insertUser();
        }
      }
    });
  };

  //******************Beginning of CRUD controller**************
  const insertUser = async () => {
    const dataForm: FormStateUser = formState;

    try {
      //the params userId is null here because we are in the insert method
      await insertOrUpdateUser(dataForm, null, 'POST');
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

  const updateUser = async () => {
    const values: FormStateUser = formState;
    const dataForm: IUser = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      isAdmin: values.isAdmin,
    };

    try {
      //Call operation API in service
      await insertOrUpdateUser(dataForm, userId.value, 'PATCH');
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

  const deleteUser = async () => {

    try {
      //Call operation API in service
      await deleteUserService(userId.value);
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
      const response: Paginate<IUser[]> = await getAllUser(
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
  //******************End filter of and paginator methods****


  onMounted(() => {
    getAllDataUser();
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
      <a-button :icon="h(PlusOutlined)" @click="handleAddUser" v-if="props.activePage === STCodeList.ACTIVE" class="btn--success ml-5">Add new</a-button>
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
                <a-input v-model:value="formState.email" size="large" placeholder="E-mail" :disabled="isView"></a-input>
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
                <a-input v-model:value="formState.firstName" size="large" placeholder="First Name" :disabled="isView"></a-input>
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
                <a-input v-model:value="formState.lastName" size="large" placeholder="Last Name" :disabled="isView"></a-input>
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
                <a-input v-model:value="formState.phone" size="large" placeholder="Phone number" :disabled="isView"></a-input>
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
                <a-switch v-model:checked="formState.isAdmin" checked-children="Admin" un-checked-children="Manager" :disabled="isView"/>
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