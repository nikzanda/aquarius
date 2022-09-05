<script setup lang="ts">
import type { Product } from '@/types/models';
import { NSpace, NCard, NIcon, NH3, NDescriptions, NDescriptionsItem, NPopconfirm, NButton } from 'naive-ui';
import { ref, type PropType } from 'vue';
import { RainDrop, Sprout, SoilMoistureField, Edit } from '@vicons/carbon';
import { useI18n } from 'vue-i18n';
import { useRefillStore } from '@/stores/refill';

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

const handleUseProduct = () => {
  loadingUseProduct.value = true;

  refillStore
    .updateLastRefill({ productId: props.product.id })
    .then(() => {
      alert('ok');
    })
    .catch(() => alert('no'))
    .finally(() => (loadingUseProduct.value = false));
};
</script>

<template>
  <n-card size="small">
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
        <!-- data ultimo inserimento prodotto in refill -->
      </n-descriptions-item>
      <n-descriptions-item v-else :label="t('products.useIn')">
        <!-- utilizzare tra X giorni -->
      </n-descriptions-item>
    </n-descriptions>

    <template #action>
      <n-space justify="end">
        <!-- TODO: pagina di modifica @click="() => $router.push({ name: '' })" -->
        <n-button tertiary circle type="info">
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
