<script setup lang="ts">
import { toQuantity } from '@/helpers/helpers';
import type { TestsOnRefills } from '@/types/models';
import { isSameDay, set } from 'date-fns';
import { type DataTableColumns, NDataTable, NDescriptions, NDescriptionsItem, NTime } from 'naive-ui';
import { computed, h, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

type TestsByData = {
  date: Date;
  testsOnRefill: TestsOnRefills[];
}

const { t } = useI18n();

const props = defineProps({
  tests: { type: Object as PropType<TestsOnRefills[]>, required: true },
});

const testsData = computed(() => {
  return props.tests
    .reduce((acc: TestsByData[], tOnRefill) => {
      const index = acc.findIndex(({ date }) => isSameDay(date, new Date(tOnRefill.createdAt)));
      if (~index) {
        acc[index].testsOnRefill.push(tOnRefill);
      } else {
        acc.push({
          date: set(new Date(tOnRefill.createdAt), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
          testsOnRefill: [tOnRefill],
        });
      }
      return acc;
    }, [])
    .sort(({ date: dateA }, { date: dateB }) => dateB.getTime() - dateA.getTime());
});

const defaultExpandedRowKeys = computed(() => {
  const dateTimes = testsData.value.map(({ date }) => date.getTime())
  const result = Math.max(...dateTimes);
  return [result];
})

const columns: DataTableColumns<TestsByData> = [
  {
    type: 'expand',
    renderExpand: ({ testsOnRefill }) => {
      const items = testsOnRefill.map(({ value, test: { name, minLevel, maxLevel } }) => {
        const hasLevels = minLevel != null && maxLevel != null;
        let color = 'white';
        let levels: any = undefined;

        if (hasLevels) {
          color = value >= minLevel && value <= maxLevel ? '#2dc937' : 'red';
          levels = h('span', { style: { color: 'grey' } }, ` (${toQuantity(minLevel)} - ${toQuantity(maxLevel)})`);
        }

        return h(
          NDescriptionsItem,
          { label: name },
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
    key: 'date',
    render: ({ date }) => h(NTime, { time: date, format: 'dd/MM/yyyy' }),
  },
];
</script>

<template>
  <n-data-table :columns="columns" :data="testsData" :row-key="({ date }) => date.getTime()" :default-expanded-row-keys="defaultExpandedRowKeys" />
</template>
