<script setup lang="ts">
import type {IUser} from "~/composables/User/User.interface";
import {User} from "~/composables/User/User";
import {registerUser} from "~/composables/Auth/auth.service";
import type {ErrorRequestHandler} from "express";

const users: IUser[] = User;

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
const formState = reactive<FormState>({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
});
const onFinish = async (values: FormState) => {
  const {email, firstName, lastName, password, confirmPassword} = values;

  if (password === confirmPassword) {
    try {
      // Call the registration service
      await registerUser(email, firstName, lastName, password);

      // Registration successful
      notification.success({
        message: 'Register Successful',
        description: 'Please login now!',
        class: 'custom-success-notification',
      });

      navigateTo(RouteList.LOGIN); // Redirect to login page
    } catch (error) {
      // Handle registration error
      notification.error({
        message: 'Register Failed',
        description: error.message,
        class: 'custom-error-notification',
      });
    }
  } else {
    notification.error({
      message: 'Registration Failed',
      description: 'Passwords do not match!',
      class: 'custom-error-notification',
    });
  }
};
</script>

<template>
  <Title>Register</Title>
  <a-layout class="layout-login">
    <a-row class="flex justify-center items-center h-screen">
      <a-col :span="10">
        <a-card :bordered="false">
          <a-row class="mt-8">
            <a-col :span="24" class="flex justify-center items-center">
              <img src="/favicon.ico" alt="" width="40" height="40" />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <h1 class="text-2xl text-center font-bold">Stock App</h1>
            </a-col>
          </a-row>
          <a-row class="mb-8">
            <a-col :span="24">
              <a-form
                  :model="formState"
                  name="horizontal_login"
                  layout="inline"
                  autocomplete="off"
                  @finish="onFinish"
              >
                <a-form-item
                    label=""
                    name="email"
                    type="email"
                    :rules="[{ required: true, type: 'email', message: 'The input is not a valid email format!' }]"
                    class="w-full mt-10"
                >
                  <a-input v-model:value="formState.email" size="large" placeholder="E-mail">
                    <template #prefix>
                      <IconsEnvelope class="secondary-color" style="font-size: 16px;"/>
                      <span class="marque_require">*</span>
                    </template>
                  </a-input>
                </a-form-item>
                <a-row :gutter="8" class="w-full">
                  <a-col :span="12">
                    <a-form-item
                        label=""
                        name="firstName"
                        type="text"
                        :rules="[{ required: true, message: 'The input your First Name!' }]"
                        class="w-full mt-5"
                    >
                      <a-input v-model:value="formState.firstName" size="large" placeholder="First name">
                        <template #prefix>
                          <UserOutlined class="secondary-color" style="font-size: 16px;"/>
                          <span class="marque_require">*</span>
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item
                        label=""
                        name="lastName"
                        type="text"
                        class="w-full mt-5 ml-1.5"
                    >
                      <a-input v-model:value="formState.lastName" size="large" placeholder="Last name">
                        <template #prefix>
                          <UserOutlined class="secondary-color" style="font-size: 16px;"/>
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item
                    label=""
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]"
                    class="w-full mt-5"
                    aria-placeholder="password"
                >
                  <a-input-password v-model:value="formState.password" size="large" placeholder="Password">
                    <template #prefix>
                      <IconsLocks class="secondary-color" style="font-size: 20px;"/>
                      <span class="marque_require">*</span>
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item
                    label=""
                    name="confirmPassword"
                    :rules="[{ required: true, message: 'Please confirm your password here!' }]"
                    class="w-full mt-5"
                    aria-placeholder="confirmPassword"
                >
                  <a-input-password v-model:value="formState.confirmPassword" size="large" placeholder="Confirm password">
                    <template #prefix>
                      <IconsLocks class="secondary-color" style="font-size: 20px;"/>
                      <span class="marque_require">*</span>
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-row class="w-full mt-10">
                  <a-form-item class="w-full">
                    <a-button class="btn btn--primary w-full" html-type="submit" size="large">Sing up</a-button>
                  </a-form-item>
                </a-row>
                <a-row class="w-full mt-5">
                  <a-col span="24 flex justify-center">
                    <p>
                      Or
                      <span><NuxtLink :to="RouteList.LOGIN" class="primary-color">Return to login ?</NuxtLink></span>
                    </p>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>

<style scoped>
.layout-login {
  background-color: #ececec;
}
</style>
