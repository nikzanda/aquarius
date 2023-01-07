<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import ProductsTable from '@/commons/ProductsTable.vue';

const store = useRefillStore();
const { lastRefill } = storeToRefs(store);
const products = computed(() => {
  const { products = [] } = lastRefill.value || {};
  return products;
});
</script>

<template>
  <products-table :products="products" />
</template>
