<script setup lang="ts">
import { AxiosKey } from '@/symbols';
import { injectStrict } from '@/helpers/injectTypes';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import type { Strip, TestsOnStrips } from '@/types/models';
import { NPageHeader, NH1, NSkeleton } from 'naive-ui';
import StripForm from './components/StripForm.vue';

const axios = injectStrict(AxiosKey);
const router = useRouter();
const route = useRoute();
const sending = ref(false);
const { id } = route.params;

const strip = ref<Strip>();

axios(`/strips/${id}`, { params: { include: 'tests' } })
  .then(({ data }) => {
    strip.value = {
      ...data,
      testsIds: data.tests.map(({ testId }: TestsOnStrips) => testId),
    };
  })
  .catch(() => router.push({ name: 'strips.list' }));

const handleSubmit = (data: any) => {
  sending.value = true;

  const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value != null));

  axios
    .patch(`/strips/${id}`, payload)
    .then(() => router.push({ name: 'strips.list' }))
    .catch(() => {})
    .finally(() => (sending.value = false));
};
</script>

<template>
  <n-page-header @back="() => $router.go(-1)">
    <template #title>
      <n-h1 v-if="strip">{{ strip.name }}</n-h1>
    </template>
  </n-page-header>

  <strip-form v-if="strip" :strip="strip" :loading="sending" @submit="handleSubmit" />
  <n-skeleton v-else text :repeat="2" />
</template>
