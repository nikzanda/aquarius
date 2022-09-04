<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';

const refillStore = useRefillStore();

if (!refillStore.lastRefill) {
  refillStore.getLastRefill();
}
</script>

<template>
  Home
  {{ refillStore.lastRefill }}
</template>
