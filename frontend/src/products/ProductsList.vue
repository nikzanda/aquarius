<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Product } from '@/types/models';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { NPageHeader, NH1, NSpace, NButton, NGrid, NGi } from 'naive-ui';
import ProductCard from './components/ProductCard.vue';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);

const products = reactive<Product[]>([]);

axios('/products', {
  params: {
    skip: 0,
    take: 0,
    sortByAsc: 'name',
  },
})
  .then(({ data: { result } }) => products.push(...result))
  .catch(console.error);
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('products.name') }}</n-h1>
    </template>
    <template #extra>
      <n-space>
        <n-button tertiary type="primary" @click="$router.push({ name: 'products.create' })">
          {{ t('commons.create') }}
        </n-button>
      </n-space>
    </template>
  </n-page-header>

  <n-grid x-gap="12" y-gap="12" cols="1 s:2 m:3 l:4 xl:4 2xl:8" responsive="screen">
    <n-gi v-for="product in products" :key="product.id">
      <product-card :product="product" />
    </n-gi>
  </n-grid>
</template>
