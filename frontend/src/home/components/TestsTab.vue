<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { NSpace, NButton } from 'naive-ui';
import TestsTable from '@/commons/TestsTable.vue';

const { t } = useI18n();
const store = useRefillStore();
const { lastRefill } = storeToRefs(store);
const tests = computed(() => {
  const { tests = [] } = lastRefill.value || {};
  return tests;
});
</script>

<template>
  <n-space vertical>
    <n-space justify="end">
      <n-button tertiary type="info" @click="$router.push({ name: 'home.water-test' })">
        {{ t('home.newTest') }}
      </n-button>
    </n-space>

    <tests-table :tests="tests" />
  </n-space>
</template>
