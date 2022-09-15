<script setup lang="ts">
import type { Test } from '@/types/models';
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NGrid,
  NGi,
  NSpace,
  NButton,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import { ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

interface TestBody {
  name: string;
  minLevel?: number;
  maxLevel?: number;
}

const props = defineProps({
  test: { type: Object as PropType<Test>, required: false },
  loading: { type: Boolean, required: true },
});
const emits = defineEmits<{
  (e: 'submit', data: TestBody): void;
}>();

const { t } = useI18n();
const form = ref<FormInst | null>(null);
const initialValues = props.test
  ? ({ ...props.test } as TestBody)
  : { name: '', minLevel: undefined, maxLevel: undefined };
const model = ref<TestBody>(initialValues);
const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('validations.required'),
    },
  ],
};

const handleSubmit = () => {
  form.value?.validate((errors) => {
    if (!errors) {
      emits('submit', model.value);
    }
  });
};
</script>

<template>
  <n-form ref="form" :model="model" :rules="rules" @submit.prevent="handleSubmit">
    <n-grid x-gap="20" y-gap="20" cols="1 s:2 m:2 l:3" responsive="screen">
      <!-- Name -->
      <n-gi>
        <n-form-item path="name" :label="t('tests.form.name')">
          <n-input v-model:value="model.name" :placeholder="t('tests.form.name')" />
        </n-form-item>
      </n-gi>

      <!-- MinLevel -->
      <n-gi>
        <n-form-item path="minLevel" :label="t('tests.form.minLevel')">
          <n-input-number
            v-model:value="model.minLevel"
            :min="0"
            :placeholder="t('tests.form.minLevel')"
            :style="{ width: '100%' }"
          />
        </n-form-item>
      </n-gi>

      <!-- MaxLevel -->
      <n-gi>
        <n-form-item path="maxLevel" :label="t('tests.form.maxLevel')">
          <n-input-number
            v-model:value="model.maxLevel"
            :min="model.minLevel || 0"
            :placeholder="t('tests.form.maxLevel')"
            :style="{ width: '100%' }"
          />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-space justify="end">
      <n-button tertiary type="primary" attr-type="submit" :loading="loading">
        {{ t(test ? 'commons.update' : 'commons.create') }}
      </n-button>
    </n-space>
  </n-form>
</template>
