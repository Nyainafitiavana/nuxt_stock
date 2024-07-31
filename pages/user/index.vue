<script setup lang="ts">
import { h } from 'vue';
import {DeleteOutlined, EyeOutlined, FormOutlined} from "#components";
import type {IUser} from "~/composables/User/User.interface";

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

const data: IUser[] = [
  {
    uuid: '1',
    firstName: 'John Brown',
    lastName: 'John',
    email: 'jhon@gmail.com',
    phone: '0342034566',
    isAdmin: true,
  },
  {
    uuid: '2',
    firstName: 'Chris Mat',
    lastName: 'Mat',
    email: 'math@gmail.com',
    phone: '0342034566',
    isAdmin: false,
  },
];

// Define the methods for button actions
const handleView = (record: IUser) => {
  message.info(`Viewing details of ${record.firstName} ${record.lastName}`);
};

const handleEdit = (record: IUser) => {
  message.info(`Editing details of ${record.firstName} ${record.lastName}`);
};

const handleDelete = (record: IUser) => {
  message.warn(`Deleting ${record.firstName} ${record.lastName}`);
};
</script>

<template>
  <a-row>
    <a-col span="24">
      <a-table
          class="w-full"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ x: 1000, y: 1000 }"
          bordered/>
    </a-col>
  </a-row>
</template>

<style scoped>

</style>
