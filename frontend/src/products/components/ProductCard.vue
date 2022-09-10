<script setup lang="ts">
import type { Product } from '@/types/models';
import {
  NSpace,
  NCard,
  NIcon,
  NH3,
  NDescriptions,
  NDescriptionsItem,
  NPopconfirm,
  NButton,
  useMessage,
  NTime,
} from 'naive-ui';
import { computed, ref, type PropType } from 'vue';
import { RainDrop, Sprout, SoilMoistureField, Edit } from '@vicons/carbon';
import { useI18n } from 'vue-i18n';
import { useRefillStore } from '@/stores/refill';
import { differenceInDays } from 'date-fns';

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});

const { t } = useI18n();
const productType = props.product.category as unknown as string;
const loadingUseProduct = ref(false);
const refillStore = useRefillStore();
const message = useMessage();
const lastUse = computed(
  () => refillStore.lastRefill?.products.filter(({ productId }) => productId === props.product.id)[0]
);
const remainingDays = computed(() => {
  if (props.product.useWhenRefilling || !lastUse.value) {
    return -1;
  }

  const differenceDays = differenceInDays(Date.now(), new Date(lastUse.value.createdAt));
  return props.product.frequencyInDays! - differenceDays;
});

const handleUseProduct = () => {
  loadingUseProduct.value = true;

  refillStore
    .updateLastRefill({ productId: props.product.id })
    .then(() => message.success('ok'))
    .catch(() => message.error('error'))
    .finally(() => (loadingUseProduct.value = false));
};
</script>

<template>
  <n-card size="small" :style="{ height: '100%' }">
    <n-space justify="space-between">
      <n-h3>{{ product.name }}</n-h3>
      <n-icon size="20" :color="productType === 'WATER' ? 'cyan' : 'green'">
        <rain-drop v-if="productType === 'WATER'" />
        <sprout v-else-if="productType === 'PLANT'" />
      </n-icon>
    </n-space>

    <n-descriptions :column="2" label-placement="left" :label-style="{ color: 'grey' }">
      <n-descriptions-item :label="t('products.frequency')">
        <span v-if="product.useWhenRefilling">
          {{ t('products.everyRefill') }}
        </span>
        <span v-else>
          {{ t('products.everyDaysFrequency', { days: product.frequencyInDays }) }}
        </span>
      </n-descriptions-item>
      <n-descriptions-item :label="t('commons.quantity')">
        {{ product.quantity }}
      </n-descriptions-item>
      <n-descriptions-item v-if="product.useWhenRefilling" :label="t('products.usedOn')">
        <n-time v-if="lastUse" :time="new Date(lastUse.createdAt)" format="dd/MM/yyyy" />
        <span v-else :style="{ color: 'red' }">{{ t('products.notUsedYet') }}</span>
      </n-descriptions-item>
      <n-descriptions-item v-else :label="t('products.useIn')">
        <span v-if="remainingDays > 1">
          {{ t('products.nextUse', { days: remainingDays }) }}
        </span>
        <span v-else-if="remainingDays === 1" :style="{ color: 'yellow' }">
          {{ t('commons.tomorrow') }}
        </span>
        <span v-else :style="{ color: 'red' }">
          {{ t('commons.today') }}
        </span>
      </n-descriptions-item>
    </n-descriptions>

    <template #action>
      <n-space justify="end">
        <n-button
          tertiary
          circle
          type="info"
          @click="
            () =>
              $router.push({
                name: 'products.update',
                params: { id: product.id },
              })
          "
        >
          <template #icon>
            <n-icon>
              <edit />
            </n-icon>
          </template>
        </n-button>

        <n-popconfirm @positive-click="handleUseProduct">
          <template #trigger>
            <n-button tertiary circle type="primary" :loading="loadingUseProduct">
              <template #icon>
                <n-icon>
                  <soil-moisture-field />
                </n-icon>
              </template>
            </n-button>
          </template>
          {{ t('products.sureToUse') }}
        </n-popconfirm>
      </n-space>
    </template>
  </n-card>
</template>
