<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Test } from '@/types/models';
import { NPageHeader, NH1, NSpace, NButton } from 'naive-ui';

const { t } = useI18n();
const axios = injectStrict(AxiosKey);

const tests = reactive<Test[]>([]);

axios('/tests', {
  params: {
    skip: 0,
    take: 0,
    sortByAsc: 'name',
  },
})
  .then(({ data: { result } }) => tests.push(...result))
  .catch(console.error);
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>{{ t('tests.name') }}</n-h1>
    </template>
    <template #extra>
      <n-space>
        <n-button tertiary type="primary" @click="$router.push({ name: 'tests.create' })">
          {{ t('commons.create') }}
        </n-button>
      </n-space>
    </template>
  </n-page-header>

  {{ tests }}
</template>
