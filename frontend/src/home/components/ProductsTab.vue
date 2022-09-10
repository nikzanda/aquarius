<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';
import type { Product } from '@/types/models';
import { RainDrop, Sprout } from '@vicons/carbon';
import { type DataTableColumns, NDataTable, NIcon, NTime, NSpace } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

type ProductRefills = Product & { refillDates: Date[] };

const { t } = useI18n();
const store = useRefillStore();
const { lastRefill } = storeToRefs(store);
const products = computed(() => {
  const { products = [] } = lastRefill.value || {};
  return products
    .reduce((acc, pOnRefill) => {
      const index = acc.findIndex(({ id }) => id === pOnRefill.productId);
      if (~index) {
        acc[index].refillDates.push(new Date(pOnRefill.createdAt));
      } else {
        acc.push({
          ...pOnRefill.product,
          refillDates: [new Date(pOnRefill.createdAt)],
        });
      }
      return acc;
    }, [] as ProductRefills[])
    .sort(({ name: nameA }, { name: nameB }) => {
      if (nameA > nameB) return 1;
      if (nameA < nameB) return -1;
      return 0;
    });
});

const columns: DataTableColumns<ProductRefills> = [
  {
    type: 'expand',
    renderExpand: ({ refillDates }) =>
      h(
        NSpace,
        { vertical: true },
        refillDates.map((time) => h(NTime, { time, format: 'dd/MM/yyyy HH:mm' }))
      ),
  },
  {
    title: t('home.table.name'),
    key: 'name',
  },
  {
    title: t('home.table.category'),
    key: 'category',
    render: ({ category }) => {
      const isWaterProductCategory = (category as unknown as string) === 'WATER';
      const color = isWaterProductCategory ? 'cyan' : 'green';
      const iconComponent = isWaterProductCategory ? RainDrop : Sprout;

      return h(
        NIcon,
        {
          color,
        },
        h(iconComponent)
      );
    },
  },
];
</script>

<template>
  <n-data-table :columns="columns" :data="products" :row-key="({ id }) => id" />
</template>
