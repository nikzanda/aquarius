<script setup lang="ts">
import { useRefillStore } from '@/stores/refill';
import {
  NPageHeader,
  NH1,
  NPopconfirm,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NTime,
  NTabs,
  NTabPane,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import ProductsTab from './components/ProductsTab.vue';

const { t } = useI18n();
const { lastRefill, createRefill } = useRefillStore();
</script>

<template>
  <n-page-header>
    <template #title>
      <n-h1>
        {{ t('home.waterState') }}
      </n-h1>
    </template>
    <template #extra>
      <n-popconfirm @positive-click="createRefill">
        <template #trigger>
          <n-button tertiary type="primary">
            {{ t('home.changeWater') }}
          </n-button>
        </template>
        {{ t('home.sureToRefill') }}
      </n-popconfirm>
    </template>
  </n-page-header>

  <n-descriptions label-placement="left">
    <n-descriptions-item :label="t('home.lastRefill')">
      <n-time v-if="lastRefill" :time="new Date(lastRefill.createdAt)" format="dd/MM/yyyy HH:mm" />
    </n-descriptions-item>
  </n-descriptions>

  <n-tabs type="line" animated>
    <!-- <n-tab-pane name="tests" :tab="t('tests.name')"> TODO... </n-tab-pane> -->
    <n-tab-pane name="products" :tab="t('products.name')">
      <products-tab />
    </n-tab-pane>
  </n-tabs>
</template>
