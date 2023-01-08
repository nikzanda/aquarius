<script setup lang="ts">
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';
import type { Strip, Test } from '@/types/models';
import {
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NGrid,
  NGi,
  NSpace,
  NButton,
  NIcon,
  type FormInst,
  type SelectOption,
} from 'naive-ui';
import { TrashCan } from '@vicons/carbon';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface TestBody {
  id: number;
  value: number;
}

interface RefillBody {
  tests: TestBody[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  loading: { type: Boolean, required: true },
});
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
const fetchingTests = ref(false);
const fetchingStrips = ref(false);
const optionsTests = ref<SelectOption[]>([]);
const optionsStrips = ref<SelectOption[]>([]);
// const stripId = ref<number | null>(null);

const searchStrip = (name: string) => {
  fetchingStrips.value = true;

  axios('/strips', {
    params: {
      skip: 0,
      take: 0,
      ...(name && { name }), // FullTextSearch di Prisma non funziona, ricerca per nome disabilitata
    },
  })
    .then(
      ({ data: { result } }) =>
        (optionsStrips.value = result.map(({ id, name }: Strip) => ({ value: id, label: name })))
    )
    .catch(() => {})
    .finally(() => (fetchingStrips.value = false));
};

const searchTest = (name: string) => {
  fetchingTests.value = true;

  axios('/tests', {
    params: {
      skip: 0,
      take: 0,
      ...(name && { name }), // FullTextSearch di Prisma non funziona, ricerca per nome disabilitata
    },
  })
    .then(
      ({ data: { result } }) => (optionsTests.value = result.map(({ id, name }: Test) => ({ value: id, label: name })))
    )
    .catch(() => {})
    .finally(() => (fetchingTests.value = false));
};

const addTest = () =>
  model.tests.push({
    id: 0,
    value: 0,
  });

const removeTest = (index: number) => model.tests.splice(index, 1);

searchStrip('');
searchTest('');

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
    <!-- <n-form-item :label="t('home.tests.form.strip')">
      <n-select
        v-model:value="stripId"
        :placeholder="t('commons.search')"
        :options="optionsStrips"
        :loading="fetchingStrips"
        remote
        @search="searchStrip"
        :style="{ width: '25%' }"
        clearable
      />
    </n-form-item> -->

    <n-grid x-gap="20" y-gap="20" cols="1 s:2 m:2 l:2" responsive="screen">
      <template v-for="(test, $index) in model.tests" :key="$index">
        <!-- Test -->
        <n-gi>
          <n-form-item
            :label="t('home.tests.form.test')"
            :path="`tests[${$index}].id`"
            :rule="{
              required: true,
              message: t('validations.required'),
            }"
          >
            <n-select
              v-model:value="test.id"
              :placeholder="t('commons.search')"
              :options="optionsTests"
              :loading="fetchingTests"
              remote
              @search="searchTest"
            />
          </n-form-item>
        </n-gi>

        <!-- Value -->
        <n-gi>
          <n-space align="center">
            <n-form-item
              :label="t('home.tests.form.value')"
              :path="`tests[${$index}].value`"
              :rule="{
                required: true,
                message: t('validations.required'),
              }"
            >
              <n-input-number v-model:value="test.value" :precision="2" :step="0.01" :style="{ width: '100%' }" />
            </n-form-item>

            <n-button tertiary circle type="error" @click="removeTest($index)">
              <template #icon>
                <n-icon><trash-can /></n-icon>
              </template>
            </n-button>
          </n-space>
        </n-gi>
      </template>
    </n-grid>

    <n-space justify="end">
      <n-button tertiary type="info" @click="addTest" :disabled="loading">
        {{ t('commons.add') }}
      </n-button>

      <n-button tertiary type="primary" attr-type="submit" :loading="loading" :disabled="model.tests.length === 0">
        {{ t('commons.create') }}
      </n-button>
    </n-space>
  </n-form>
</template>
