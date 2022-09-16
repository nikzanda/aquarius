<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Strip, Test } from '@/types/models';
import {
  NForm,
  NFormItem,
  NInput,
  NGrid,
  NGi,
  NSpace,
  NButton,
  NCheckboxGroup,
  NCheckbox,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import { reactive, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

interface StripBody {
  name: string;
  description?: string;
  testsIds: number[];
}

const props = defineProps({
  strip: { type: Object as PropType<Strip>, required: false },
  loading: { type: Boolean, required: true },
});
const emits = defineEmits<{
  (e: 'submit', data: StripBody): void;
}>();

const { t } = useI18n();
const axios = injectStrict(AxiosKey);
const form = ref<FormInst | null>(null);
const initialValues = props.strip
  ? ({ ...props.strip } as unknown as StripBody)
  : { name: '', description: undefined, testsIds: [] };
const model = ref<StripBody>(initialValues);
const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('validations.required'),
    },
  ],
};
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
        <n-form-item path="name" :label="t('strips.form.name')">
          <n-input v-model:value="model.name" :placeholder="t('strips.form.name')" />
        </n-form-item>
      </n-gi>

      <!-- Description -->
      <n-gi>
        <n-form-item path="description" :label="t('strips.form.description')">
          <n-input v-model:value="model.description" :placeholder="t('strips.form.description')" />
        </n-form-item>
      </n-gi>

      <!-- Tests -->
      <n-gi :span="24">
        <n-form-item path="testsIds" :label="t('strips.form.tests')">
          <n-checkbox-group v-model:value="model.testsIds">
            <n-space>
              <n-checkbox v-for="test in tests" :key="test.id" :value="test.id" :label="test.name" />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-space justify="end">
      <n-button tertiary type="primary" attr-type="submit" :loading="loading">
        {{ t(strip ? 'commons.update' : 'commons.create') }}
      </n-button>
    </n-space>
  </n-form>
</template>
