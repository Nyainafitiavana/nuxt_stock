<script setup lang="ts">
  import type {IUser} from "~/composables/User/User.interface";
  import {User} from "~/composables/User/User";
  import {loginUser} from "~/composables/Auth/auth.service";
  interface FormState {
    email: string;
    password: string;
  }
  const formState = reactive<FormState>({
    email: '',
    password: '',
  });

  const router = useRouter();
  const onFinish = async (values: FormState) => {
    const {email, password} = values;

    try {
      const data: { message: string; user: IUser } = await loginUser({email, password});
      localStorage.setItem('userConnect', 'true');
      localStorage.setItem('userId', data.user.id.toString());
      localStorage.setItem('role', data.user.role.toString());

      notification.success({
        message: 'Login Successful',
        description: 'You are now logged in!',
        class: 'custom-success-notification'
      });

      if (data.user.role == 'ADMIN') {
        await router.push(RouteList.DASHBOARD);
      } else {
        await router.push(RouteList.ORDER);
      }

    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.message,
        class: 'custom-error-notification'
      });
    }
  };
</script>

<template>
  <Title>Login</Title>
  <a-layout class="layout-login">
    <a-row class="flex justify-center items-center h-screen">
      <a-col :span="7">
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
                    </template>
                  </a-input>
                </a-form-item>
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
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-row class="w-full mt-10">
                  <a-form-item class="w-full">
                    <a-button class="btn btn--primary w-full" html-type="submit" size="large">Log in</a-button>
                  </a-form-item>
                </a-row>
                <a-row class="w-full mt-5">
                  <a-col span="24 flex justify-center">
                    <p>
                      Or
                      <span><NuxtLink :to="RouteList.REGISTER" class="primary-color">register now!</NuxtLink></span>
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
