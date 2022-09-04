<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { ProductCategory } from '@/types/models';
import {
  NPageHeader,
  NH1,
  NForm,
  NFormItem,
  NInput,
  type FormInst,
  type FormRules,
  NButton,
  NRadioGroup,
  NRadio,
  NGrid,
  NGi,
  NSpace,
  NSwitch,
  NInputNumber,
} from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface ProductCreate {
  name: string;
  category: string;
  quantity?: string;
  frequencyInDays?: number;
  useWhenRefilling: boolean;
}

const { t } = useI18n();
const axios = injectStrict(AxiosKey);
const sending = ref(false);
const form = ref<FormInst | null>(null);
const model = ref<ProductCreate>({
  name: '',
  category: 'WATER',
  quantity: undefined,
  frequencyInDays: undefined,
  useWhenRefilling: true,
});
const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('commons.required'),
    },
  ],
  category: [
    {
      required: true,
      message: t('commons.required'),
    },
  ],
};
const productCategoriesOptions = Object.values(ProductCategory).filter((v) => typeof v === 'string') as string[];

const handleSubmit = () => {
  form.value?.validate((errors) => {
    if (errors) {
      return;
    }

    sending.value = true;

    axios
      .post('/products', model.value)
      .then(() => alert('ok'))
      .catch(() => alert('no'))
      .finally(() => (sending.value = false));
  });
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1>{{ t('products.createPage.title') }}</n-h1>
    </template>
  </n-page-header>

  <n-form ref="form" :model="model" :rules="rules" @submit.prevent="handleSubmit">
    <n-grid x-gap="20" y-gap="20" cols="1 s:2 m:2 l:3" responsive="screen">
      <!-- Name -->
      <n-gi>
        <n-form-item path="name" :label="t('products.form.name')">
          <n-input v-model:value="model.name" :placeholder="t('products.form.name')" />
        </n-form-item>
      </n-gi>

      <!-- Category -->
      <n-gi>
        <n-form-item path="category" :label="t('products.form.category')">
          <n-radio-group v-model:value="model.category">
            <n-radio
              v-for="category in productCategoriesOptions"
              :key="category"
              :value="category"
              :label="t(`products.category.${category.toLowerCase()}`)"
            />
          </n-radio-group>
        </n-form-item>
      </n-gi>

      <!-- Quantity -->
      <n-gi>
        <n-form-item path="quantity" :label="t('products.form.quantity')">
          <n-input v-model:value="model.quantity" :placeholder="t('products.form.quantity')" />
        </n-form-item>
      </n-gi>

      <!-- Use when refilling -->
      <n-gi>
        <n-form-item path="useWhenRefilling" :label="t('products.form.useWhenRefilling')">
          <n-switch v-model:value="model.useWhenRefilling" />
        </n-form-item>
      </n-gi>

      <!-- Frequency in days -->
      <n-gi v-if="!model.useWhenRefilling">
        <n-form-item path="frequencyInDays" :label="t('products.form.frequencyInDays')">
          <n-input-number
            v-model:value="model.frequencyInDays"
            button-placement="both"
            :placeholder="t('products.form.frequencyInDays')"
            :min="0"
          />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-space justify="end">
      <n-button tertiary type="primary" attr-type="submit" :loading="sending">
        {{ t('commons.create') }}
      </n-button>
    </n-space>
  </n-form>
</template>
