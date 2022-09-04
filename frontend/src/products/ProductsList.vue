<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Product } from '@/types/models';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { NPageHeader, NH1, NSpace, NButton, NGrid, NGi } from 'naive-ui';

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
          {{ t('products.create') }}
        </n-button>
      </n-space>
    </template>
  </n-page-header>

  <p>
    {{products}}
  </p>
</template>
