<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { computed, h } from 'vue';
import { NDataTable, type DataTableColumns, NSpace, NTime, NButton } from 'naive-ui';
import type { TestsOnRefills } from '@/types/models';

const { t } = useI18n();
const store = useRefillStore();
const { lastRefill } = storeToRefs(store);
const tests = computed(() => {
  const { tests = [] } = lastRefill.value || {};
  return tests;
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
        levels = h('span', { style: { color: 'grey' } }, ` (${minLevel} - ${maxLevel})`);
      }

      return h('span', { style: { color } }, [value, levels]);
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
  <n-space vertical>
    <n-space justify="end">
      <n-button tertiary type="info" @click="$router.push({ name: 'home.water-test' })">
        {{ t('home.newTest') }}
      </n-button>
    </n-space>

    <n-data-table :columns="columns" :data="tests" :row-key="({ id }) => id" />
  </n-space>
</template>
