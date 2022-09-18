<script setup lang="ts">
import { AxiosKey } from '@/symbols';
import { injectStrict } from '@/helpers/injectTypes';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import type { Test } from '@/types/models';
import { NPageHeader, NH1, NSkeleton } from 'naive-ui';
import TestForm from './components/TestForm.vue';

const axios = injectStrict(AxiosKey);
const router = useRouter();
const route = useRoute();
const sending = ref(false);
const { id } = route.params;

const test = ref<Test>();

axios(`/tests/${id}`)
  .then(({ data }) => (test.value = data))
  .catch(() => router.push({ name: 'tests.list' }));

const handleSubmit = (data: any) => {
  sending.value = true;

  const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value != null));

  axios
    .patch(`/tests/${id}`, payload)
    .then(() => router.push({ name: 'tests.list' }))
    .catch(() => {})
    .finally(() => (sending.value = false));
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1 v-if="test">{{ test.name }}</n-h1>
    </template>
  </n-page-header>

  <test-form v-if="test" :test="test" :loading="sending" @submit="handleSubmit" />
  <n-skeleton v-else text :repeat="2" />
</template>
