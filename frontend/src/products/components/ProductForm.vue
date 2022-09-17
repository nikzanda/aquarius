<script setup lang="ts">
import { ProductCategory, type Product } from '@/types/models';
import {
  NForm,
  NFormItem,
  NInput,
  type FormInst,
  type FormRules,
  NButton,
  NRadioGroup,
  NRadio,
  NGrid,
  NGi,
  NSpace,
  NSwitch,
  NInputNumber,
} from 'naive-ui';
import { ref, computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

interface ProductBody {
  name: string;
  category: string;
  quantity?: string;
  frequencyInDays?: number;
  useWhenRefilling: boolean;
}

const props = defineProps({
  product: { type: Object as PropType<Product>, required: false },
  loading: { type: Boolean, required: true },
});
const emits = defineEmits<{
  (e: 'submit', data: ProductBody): void;
}>();

const { t } = useI18n();
const form = ref<FormInst | null>(null);
const initialValues = props.product
  ? ({ ...props.product } as unknown as ProductBody)
  : {
      name: '',
      category: 'WATER',
      quantity: undefined,
      frequencyInDays: undefined,
      useWhenRefilling: true,
    };
const model = ref<ProductBody>(initialValues);
const rules = computed(
  () =>
    ({
      name: [
        {
          required: true,
          message: t('validations.required'),
        },
      ],
      frequencyInDays: [
        {
          required: !model.value.useWhenRefilling,
          message: t('validations.required'),
        },
      ],
    } as FormRules)
);
const productCategoriesOptions = Object.values(ProductCategory).filter((v) => typeof v === 'string') as string[];

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
        <n-form-item path="name" :label="t('products.form.name')">
          <n-input v-model:value="model.name" :placeholder="t('products.form.name')" />
        </n-form-item>
      </n-gi>

      <!-- Category -->
      <n-gi>
        <n-form-item path="category" :label="t('products.form.category')">
          <n-radio-group v-model:value="model.category">
            <n-radio
              v-for="category in productCategoriesOptions"
              :key="category"
              :value="category"
              :label="t(`products.category.${category.toLowerCase()}`)"
            />
          </n-radio-group>
        </n-form-item>
      </n-gi>

      <!-- Quantity -->
      <n-gi>
        <n-form-item path="quantity" :label="t('products.form.quantity')">
          <n-input v-model:value="model.quantity" :placeholder="t('products.form.quantity')" />
        </n-form-item>
      </n-gi>

      <!-- Use when refilling -->
      <n-gi>
        <n-form-item path="useWhenRefilling" :label="t('products.form.useWhenRefilling')">
          <n-switch v-model:value="model.useWhenRefilling" />
        </n-form-item>
      </n-gi>

      <!-- Frequency in days -->
      <n-gi v-if="!model.useWhenRefilling">
        <n-form-item path="frequencyInDays" :label="t('products.form.frequencyInDays')">
          <n-input-number
            v-model:value="model.frequencyInDays"
            button-placement="both"
            :placeholder="t('products.form.frequencyInDays')"
            :min="1"
            :style="{ width: '100%' }"
          />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-space justify="end">
      <n-button tertiary type="primary" attr-type="submit" :loading="loading">
        {{ t(product ? 'commons.update' : 'commons.create') }}
      </n-button>
    </n-space>
  </n-form>
</template>
