<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Refill } from '@/types/models';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { NPageHeader, NH1, NDataTable, type DataTableColumns, NButton } from 'naive-ui';
import { format } from 'date-fns';
import { h } from 'vue';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);

const refills = reactive<Refill[]>([]);
const columns: DataTableColumns<Refill> = [
  {
    type: 'expand',
    renderExpand: ({ products }) => {
      return JSON.stringify(products);
    },
  },
  {
    title: t('refills.createdAt'),
    key: 'createdAt',
    render({ createdAt }) {
      return format(new Date(createdAt), 'dd/MM/yyyy HH:mm');
    },
  },
  {
    title: t('commons.actions'),
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => console.log(row),
        },
        { default: () => t('refills.add') }
      );
    },
  },
];

axios('/refills', {
  params: {
    skip: 0,
    take: 0,
    sortByDesc: 'createdAt',
  },
})
  .then(({ data: { result } }) => refills.push(...result))
  .catch(console.error); // TODO: gestire errore globalmente
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('refills.name') }}</n-h1>
    </template>
  </n-page-header>

  <n-data-table :columns="columns" :data="refills" :row-key="({ id }) => id" />
</template>
