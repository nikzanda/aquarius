<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { h, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Test } from '@/types/models';
import { NPageHeader, NH1, NSpace, NButton, type DataTableColumns, NDataTable, NIcon, NPopconfirm } from 'naive-ui';
import { useRouter } from 'vue-router';
import { Edit, TrashCan } from '@vicons/carbon';
import { toQuantity } from '@/helpers/helpers';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);
const router = useRouter();

const tests = reactive<Test[]>([]);

axios('/tests', {
  params: {
    skip: 0,
    take: 0,
    sortByAsc: 'name',
  },
})
  .then(({ data: { result } }) => tests.push(...result))
  .catch(console.error);

const handleDelete = (testId: number) => {
  axios
    .delete(`/tests/${testId}`)
    .then(() => {
      const index = tests.findIndex(({ id }) => id === testId);
      if (~index) tests.splice(index, 1);
    })
    .catch(() => {});
};

const columns: DataTableColumns<Test> = [
  {
    title: t('tests.table.name'),
    key: 'name',
  },
  {
    title: t('tests.table.minLevel'),
    key: 'minLevel',
    render: ({ minLevel }) => minLevel && toQuantity(minLevel),
  },
  {
    title: t('tests.table.maxLevel'),
    key: 'maxLevel',
    render: ({ maxLevel }) => maxLevel && toQuantity(maxLevel),
  },
  {
    title: t('commons.actions'),
    key: 'actions',
    render: ({ id }) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                tertiary: true,
                circle: true,
                type: 'info',
                onClick: () =>
                  router.push({
                    name: 'tests.update',
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
                default: () => t('tests.sureToDelete'),
              }
            ),
          ],
        }
      );
    },
  },
];
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('tests.name') }}</n-h1>
    </template>
    <template #extra>
      <n-space>
        <n-button tertiary type="primary" @click="$router.push({ name: 'tests.create' })">
          {{ t('commons.create') }}
        </n-button>
      </n-space>
    </template>
  </n-page-header>

  <n-data-table :columns="columns" :data="tests" :row-key="({ id }) => id" />
</template>
