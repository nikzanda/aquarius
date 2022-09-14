<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { NPageHeader, NH1 } from 'naive-ui';
import TestForm from './components/TestForm.vue';

const { t } = useI18n();
const router = useRouter();
const axios = injectStrict(AxiosKey);
const sending = ref(false);

const handleSubmit = (data: any) => {
  sending.value = true;

  axios
    .post('/tests', data)
    .then(() => router.push({ name: 'tests.list' }))
    .catch(() => {})
    .finally(() => (sending.value = false));
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1>{{ t('tests.createPage.title') }}</n-h1>
    </template>
  </n-page-header>

  <test-form :loading="sending" @submit="handleSubmit" />
</template>
