<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';

const refillStore = useRefillStore();
</script>

<template>
  Home
  {{ refillStore.lastRefill }}
</template>
