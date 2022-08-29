<script setup lang="ts">
import { reactive } from 'vue';
import { NPageHeader, NH1, NGrid, NGi } from 'naive-ui';
import type { Category } from '@/types/models';
import CategoryCard from './components/CategoryCard.vue';
import { useI18n } from 'vue-i18n';
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);

const categories = reactive<Category[]>([]);

axios('/categories', {
  params: {
    skip: 0,
    take: 0,
    include: 'filters',
    sortByAsc: 'name'
  },
})
  .then(({ data }) => categories.push(...data))
  .catch(console.error);
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('filters.name') }}</n-h1>
    </template>
  </n-page-header>

  <n-grid x-gap="12" y-gap="12" cols="1 s:2 m:3 l:4 xl:4 2xl:8" responsive="screen">
    <n-gi v-for="category in categories" :key="category.id">
      <category-card :category="category" />
    </n-gi>
  </n-grid>
</template>
