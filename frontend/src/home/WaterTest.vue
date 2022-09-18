<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { useRefillStore } from '@/stores/refill';
import { AxiosKey } from '@/symbols';
import { NPageHeader, NH1 } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import TestForm from './components/TestForm.vue';

const { t } = useI18n();
const router = useRouter();
const axios = injectStrict(AxiosKey);
const store = useRefillStore();
const { lastRefill } = storeToRefs(store);
const sending = ref(false);

const handleSubmit = (data: any) => {
  sending.value = true;

  axios
    .patch(`/refills/${lastRefill.value!.id}`, data)
    .then(() => {
      store.getLastRefill();
      router.push({ name: 'home' });
    })
    .catch(() => {})
    .finally(() => (sending.value = false));
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1>{{ t('home.tests.pageTitle') }}</n-h1>
    </template>
  </n-page-header>

  <test-form :loading="sending" @submit="handleSubmit" />
</template>
