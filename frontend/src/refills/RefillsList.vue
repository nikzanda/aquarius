<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Refill } from '@/types/models';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NPageHeader, NH1, NDataTable } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { format } from 'date-fns';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);

const refills = reactive<Refill[]>([]);
const loading = ref(true);
const pagination = reactive<PaginationProps>({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  defaultPageSize: 10,
  pageSizes: [5, 10, 20, 50],
  showSizePicker: true,
  prefix({ itemCount: total }) {
    return t('commons.total', { total })
  },
});

const columns: DataTableColumns<Refill> = [
  {
    type: 'expand',
    renderExpand: ({ products }) => {
      return JSON.stringify(products);
    },
  },
  {
    title: t('refills.table.createdAt'),
    key: 'createdAt',
    render({ createdAt }) {
      return format(new Date(createdAt), 'dd/MM/yyyy HH:mm');
    },
  },
];

const fetchData = () => {
  loading.value = true;

  axios('/refills', {
    params: {
      skip: (pagination.page! - 1) * pagination.pageSize!,
      take: pagination.pageSize,
      sortByDesc: 'createdAt',
    },
  })
    .then(({ data: { result, count } }) => {
      refills.splice(0, refills.length);
      refills.push(...result);
      pagination.pageCount = Math.ceil(count / pagination.pageSize!);
    })
    .catch(console.error) // TODO: gestire errore globalmente
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  fetchData();
});

const handlePageChange = (currentPage: number) => {
  if (loading.value) {
    return;
  }

  pagination.page = currentPage;
  fetchData();
};

const handlePageSizeChange = (currentPageSize: number) => {
  if (loading.value) {
    return;
  }

  pagination.pageSize = currentPageSize
  pagination.page = 1
  fetchData()
}
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('refills.name') }}</n-h1>
    </template>
  </n-page-header>

  <n-data-table
    remote
    :columns="columns"
    :data="refills"
    :loading="loading"
    :pagination="pagination"
    :row-key="({ id }) => id"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  />
</template>
