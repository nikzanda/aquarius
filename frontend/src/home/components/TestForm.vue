<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Test } from '@/types/models';
import {
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NGrid,
  NGi,
  NSpace,
  NButton,
  type FormInst,
  type SelectOption,
} from 'naive-ui';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface TestBody {
  id: number;
  value: number;
}

interface RefillBody {
  tests: TestBody[];
}

const emits = defineEmits<{
  (e: 'submit', data: RefillBody): void;
}>();

const { t } = useI18n();
const axios = injectStrict(AxiosKey);
const form = ref<FormInst | null>(null);
const model = reactive({
  tests: [
    {
      id: 0,
      value: 0,
    },
  ],
});
const loading = ref(false);
const options = ref<SelectOption[]>([]);

const handleSearch = (name: string) => {
  loading.value = true;

  axios('/tests', {
    params: {
      skip: 0,
      take: 0,
      ...(name && { name }), // FullTextSearch di Prisma non funziona, ricerca per nome disabilitata
    },
  })
    .then(({ data: { result } }) => (options.value = result.map(({ id, name }: Test) => ({ value: id, label: name }))))
    .catch(() => {})
    .finally(() => (loading.value = false));
};

const addTest = () =>
  model.tests.push({
    id: 0,
    value: 0,
  });

handleSearch('');

const handleSubmit = () => {
  form.value?.validate((errors) => {
    if (!errors) {
      emits('submit', model);
    }
  });
};
</script>

<template>
  <n-form ref="form" :model="model" @submit.prevent="handleSubmit">
    <n-grid x-gap="20" y-gap="20" cols="1 s:2 m:2 l:2" responsive="screen">
      <template v-for="(test, $index) in model.tests" :key="$index">
        <!-- Test -->
        <n-gi>
          <n-form-item
            :label="t('home.form.test')"
            :path="`tests[${$index}].id`"
            :rule="{
              required: true,
              message: t('validations.required'),
            }"
          >
            <n-select
              v-model:value="test.id"
              :placeholder="t('commons.search')"
              :options="options"
              :loading="loading"
              remote
              @search="handleSearch"
            />
          </n-form-item>
        </n-gi>

        <!-- Value -->
        <n-gi>
          <n-form-item
            :label="t('home.form.value')"
            :path="`tests[${$index}].value`"
            :rule="{
              required: true,
              message: t('validations.required'),
            }"
          >
            <n-input-number v-model:value="test.value" />
          </n-form-item>
        </n-gi>
      </template>
    </n-grid>

    <n-space justify="end">
      <n-button tertiary type="info" @click="addTest">
        {{ t('commons.add') }}
      </n-button>

      <n-button tertiary type="primary" attr-type="submit">
        {{ t('commons.create') }}
      </n-button>
    </n-space>
  </n-form>
</template>
