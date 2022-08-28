<script setup lang="ts">
import { reactive } from 'vue';
import { NGrid, NGi } from 'naive-ui';
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
  },
})
  .then(({ data }) => categories.push(...data))
  .catch(console.error);
</script>

<template>
  <h1>{{ t('filters.name') }}</h1>

  <n-grid x-gap="12" y-gap="12" cols="1 s:2 m:3 l:4 xl:5 2xl:8" responsive="screen">
    <n-gi v-for="category in categories" :key="category.id">
      <category-card :category="category" />
    </n-gi>
  </n-grid>
</template>
