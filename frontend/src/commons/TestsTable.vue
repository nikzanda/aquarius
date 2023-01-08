<script setup lang="ts">
import { toQuantity } from '@/helpers/helpers';
import type { Test, TestsOnRefills } from '@/types/models';
import { format } from 'date-fns';
import { type DataTableColumns, NDataTable, NDescriptions, NDescriptionsItem } from 'naive-ui';
import { computed, h, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  tests: { type: Object as PropType<TestsOnRefills[]>, required: true },
});

const testsData = computed(() => {
  return props.tests
    .reduce((acc: Test[], tOnRefill) => {
      const index = acc.findIndex(({ id }) => id === tOnRefill.testId);
      if (~index) {
        acc[index].refills.push(tOnRefill);
      } else {
        acc.push({
          ...tOnRefill.test,
          refills: [tOnRefill],
        });
      }
      return acc;
    }, [])
    .sort(({ name: nameA }, { name: nameB }) => {
      if (nameA > nameB) return 1;
      if (nameA < nameB) return -1;
      return 0;
    });
});

const columns: DataTableColumns<Test> = [
  {
    type: 'expand',
    renderExpand: ({ refills }) => {
      const items = refills.map(({ value, createdAt, test: { minLevel, maxLevel } }) => {
        const hasLevels = minLevel != null && maxLevel != null;
        let color = 'white';
        let levels: any = undefined;

        if (hasLevels) {
          color = value >= minLevel && value <= maxLevel ? '#2dc937' : 'red';
          levels = h('span', { style: { color: 'grey' } }, ` (${toQuantity(minLevel)} - ${toQuantity(maxLevel)})`);
        }

        const label = format(new Date(createdAt), 'dd/MM/yyyy HH:mm');

        return h(
          NDescriptionsItem,
          { label },
          { default: () => h('span', { style: { color } }, [toQuantity(value), levels]) }
        );
      });

      return h(
        NDescriptions,
        { labelPlacement: 'left', bordered: true },
        {
          default: () => items,
        }
      );
    },
  },
  {
    title: t('home.tab.tests.table.name'),
    key: 'name',
    render: ({ name }) => name,
  },
];
</script>

<template>
  <n-data-table :columns="columns" :data="testsData" :row-key="({ id }) => id" />
</template>
