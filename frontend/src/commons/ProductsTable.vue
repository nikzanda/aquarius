<script setup lang="ts">
import type { Product, ProductsOnRefills } from '@/types/models';
import { RainDrop, Sprout } from '@vicons/carbon';
import { type DataTableColumns, NTime, NDataTable, NIcon, NSpace } from 'naive-ui';
import { computed, h, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

type ProductRefills = Product & { refillDates: Date[] };

const { t } = useI18n();

const props = defineProps({
  products: { type: Object as PropType<ProductsOnRefills[]>, required: true },
});

const productsData = computed(() => {
  return props.products
    .reduce((acc: ProductRefills[], pOnRefill) => {
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
    }, [])
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
        {
          default: () => refillDates.map((time) => h(NTime, { time, format: 'dd/MM/yyyy HH:mm' })),
        }
      ),
  },
  {
    title: t('home.tab.products.table.name'),
    key: 'name',
  },
  {
    title: t('home.tab.products.table.category'),
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
        { default: () => h(iconComponent) }
      );
    },
  },
];
</script>

<template>
  <n-data-table :columns="columns" :data="productsData" :row-key="({ id }) => id" />
</template>
