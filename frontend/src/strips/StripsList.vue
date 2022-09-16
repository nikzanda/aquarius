<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { h, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Strip } from '@/types/models';
import { NPageHeader, NH1, NSpace, NButton, type DataTableColumns, NDataTable, NIcon, NPopconfirm } from 'naive-ui';
import { useRouter } from 'vue-router';
import { Edit, TrashCan } from '@vicons/carbon';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);
const router = useRouter();

const strips = reactive<Strip[]>([]);

// TODO: includi tests
axios('/strips', {
  params: {
    skip: 0,
    take: 0,
    sortByAsc: 'name',
    include: 'tests',
  },
})
  .then(({ data: { result } }) => strips.push(...result))
  .catch(console.error);

const handleDelete = (stripId: number) => {
  axios
    .delete(`/strips/${stripId}`)
    .then(() => {
      const index = strips.findIndex(({ id }) => id === stripId);
      if (~index) strips.splice(index, 1);
    })
    .catch(() => {});
};

const columns: DataTableColumns<Strip> = [
  {
    title: t('strips.table.name'),
    key: 'name',
  },
  {
    title: t('strips.table.description'),
    key: 'description',
  },
  {
    title: t('commons.actions'),
    key: 'actions',
    render: ({ id }) => {
      return h(NSpace, {}, [
        h(
          NButton,
          {
            tertiary: true,
            circle: true,
            type: 'info',
            onClick: () =>
              router.push({
                name: 'strips.update',
                params: { id },
              }),
          },
          {
            default: () => h(NIcon, {}, { default: () => h(Edit) }),
          }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(id),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  tertiary: true,
                  circle: true,
                  type: 'error',
                },
                {
                  default: () => h(NIcon, {}, { default: () => h(TrashCan) }),
                }
              ),
            default: () => t('strips.sureToDelete'),
          }
        ),
      ]);
    },
  },
];
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('strips.name') }}</n-h1>
    </template>
    <template #extra>
      <n-space>
        <n-button tertiary type="primary" @click="$router.push({ name: 'strips.create' })">
          {{ t('commons.create') }}
        </n-button>
      </n-space>
    </template>
  </n-page-header>

  <n-data-table :columns="columns" :data="strips" :row-key="({ id }) => id" />
</template>
