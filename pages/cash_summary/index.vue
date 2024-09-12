<script setup lang="ts">
  import {translations} from "~/composables/translations";
  import {ref} from "vue";
  import type {ICashSummary, IFormCashSummary} from "~/composables/cash/cashSummary.interface";
  import {AInputNumber} from "#components";
  import {handleInAuthorizedError} from "~/composables/CustomError";
  import {getCashSummary} from "~/composables/cash/cashSummary.service";
  import type {ICurrency} from "~/composables/settings/general/settings.interface";
  import {getCurrencyService} from "~/composables/settings/general/settings.service";
  import {formatPrice} from "~/composables/helper";

  definePageMeta({
    layout: 'navbar',
    title: 'Cash summary',
    middleware: ['user-middleware', 'admin-middleware']
  });

  //This is a global state for language of the app
  const language = useLanguage();
  const isLoading = ref<boolean>(true);
  const currencyType = ref<string>('');

  const formState = reactive<IFormCashSummary>({
    amount_output: '',
    amount_input: '',
    initial_cash: '',
    real_cash: '',
  });

  const getDataForm = async () => {
    try {
      const cashSummary: ICashSummary = await getCashSummary();
      //set all value of formState when we have a data
      formState.initial_cash = formatPrice(cashSummary.initial_cash);
      formState.amount_input = formatPrice(cashSummary.amount_input);
      formState.amount_output = formatPrice(cashSummary.amount_output);
      formState.real_cash = formatPrice(cashSummary.real_cash);

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

  const getCurrencyType = async () => {
    try {
      const dataCurrencyType: ICurrency = await getCurrencyService();

      currencyType.value = dataCurrencyType.currencyType;

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
        message: translations[language.value].error,
        description: (error as Error).message,
        class: 'custom-error-notification'
      });
    }
  }

  onMounted(async () => {
    await getDataForm();
    await getCurrencyType();
    isLoading.value = false;
  });
</script>

<template>
  <div>
    <Title>{{ translations[language].cashSummary }}</Title>
    <ATypographyTitle class="flex" style="font-size: 20px;">
      <user-outlined  />&nbsp;
      <span>{{ translations[language].cashSummary }}</span>
    </ATypographyTitle>
    <Loading :is-loading="isLoading" :size="'large'"/>
    <a-row v-if="!isLoading">
      <a-col class="w-full">
        <a-form
            :model="formState"
            name="basic"
            layout="inline"
            autocomplete="off"
        >
          <a-form-item
              name="amount_input"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="3"><label for="basic_amount_input">{{ translations[language].amountInput }}:</label></a-col>
              <a-col span="3">
                <a-input-number class="w-full" v-model:value="formState.amount_input"disabled>
                  <template #addonAfter>{{ currencyType }}</template>
                </a-input-number>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="amount_output"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="3"><label for="basic_amount_output">{{ translations[language].amountOutput }}:</label></a-col>
              <a-col span="3">
                <a-input-number class="w-full" v-model:value="formState.amount_output" :min="0" disabled>
                  <template #addonAfter>{{ currencyType }}</template>
                </a-input-number>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="initial_cash"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="3"><label for="basic_initial_cash">{{ translations[language].initialCash }}:</label></a-col>
              <a-col span="3">
                <a-input-number class="w-full" v-model:value="formState.initial_cash" :min="0" disabled>
                  <template #addonAfter>{{ currencyType }}</template>
                </a-input-number>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
              name="real_cash"
              class="w-full mt-10"
          >
            <a-row>
              <a-col span="3"><label for="basic_real_cash">{{ translations[language].realCash }}:</label></a-col>
              <a-col span="3">
                <a-input-number class="w-full" v-model:value="formState.real_cash" :min="0" disabled>
                  <template #addonAfter>{{ currencyType }}</template>
                </a-input-number>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>

</style>