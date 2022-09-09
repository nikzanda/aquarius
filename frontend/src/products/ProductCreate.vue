<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { NPageHeader, NH1 } from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ProductForm from './components/ProductForm.vue';

const { t } = useI18n();
const router = useRouter();
const axios = injectStrict(AxiosKey);
const sending = ref(false);

const handleSubmit = (data: any) => {
  sending.value = true;

  axios
    .post('/products', data)
    .then(() => router.push({ name: 'products.list' }))
    .catch(() => {})
    .finally(() => (sending.value = false));
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1>{{ t('products.createPage.title') }}</n-h1>
    </template>
  </n-page-header>

  <product-form :loading="sending" @submit="handleSubmit" />
</template>
