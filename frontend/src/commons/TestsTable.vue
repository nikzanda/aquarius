<script setup lang="ts">
import { toQuantity } from '@/helpers/helpers';
import type { TestsOnRefills } from '@/types/models';
import { type DataTableColumns, NTime, NDataTable } from 'naive-ui';
import { h, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  tests: { type: Object as PropType<TestsOnRefills[]>, required: true },
});

const columns: DataTableColumns<TestsOnRefills> = [
  {
    title: t('home.tab.tests.table.name'),
    key: 'name',
    render: ({ test: { name } }) => name,
  },
  {
    title: t('home.tab.tests.table.value'),
    key: 'value',
    render: ({ value, test: { minLevel, maxLevel } }) => {
      const hasLevels = minLevel != null && maxLevel != null;
      let color = undefined;
      let levels = undefined;

      if (hasLevels) {
        color = value >= minLevel && value <= maxLevel ? '#2dc937' : 'red';
        levels = h('span', { style: { color: 'grey' } }, ` (${toQuantity(minLevel)} - ${toQuantity(maxLevel)})`);
      }

      return h('span', { style: { color } }, [toQuantity(value), levels]);
    },
  },
  {
    title: t('home.tab.tests.table.createdAt'),
    key: 'createdAt',
    render: ({ createdAt }) => h(NTime, { time: new Date(createdAt), format: 'dd/MM/yyyy HH:mm' }),
  },
];
</script>

<template>
  <n-data-table :columns="columns" :data="tests" :row-key="({ id }) => id" />
</template>
