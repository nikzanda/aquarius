<script setup lang="ts">
import type { Product } from '@/types/models';
import { ref } from 'vue';
import { NPageHeader, NH1, NSkeleton } from 'naive-ui';
import ProductForm from './components/ProductForm.vue';
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { useRoute, useRouter } from 'vue-router';

const axios = injectStrict(AxiosKey);
const router = useRouter();
const route = useRoute();
const sending = ref(false);
const { id } = route.params;

const product = ref<Product>();

axios(`/products/${id}`)
  .then(({ data }) => (product.value = data))
  .catch(() => {});

const handleSubmit = (data: any) => {
  sending.value = true;

  const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value != null));

  axios
    .patch(`/products/${id}`, payload)
    .then(() => router.push({ name: 'products.list' }))
    .catch(() => {})
    .finally(() => (sending.value = false));
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1 v-if="product">{{ product.name }}</n-h1>
    </template>
  </n-page-header>

  <product-form v-if="product" :product="product" :loading="sending" @submit="handleSubmit" />
  <n-skeleton v-else text :repeat="2" />
</template>
