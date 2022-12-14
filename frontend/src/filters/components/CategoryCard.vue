<script setup lang="ts">
import type { Category, Filter } from '@/types/models';
import { computed, ref, type PropType } from 'vue';
import {
  NSpace,
  NCard,
  NButton,
  NIcon,
  NTime,
  NImage,
  NPopconfirm,
  NSpin,
  NGrid,
  NGi,
  NDescriptions,
  NDescriptionsItem,
  NNumberAnimation,
  NH3,
  NTooltip,
  useMessage,
  NBadge,
} from 'naive-ui';
import { Renew, TrashCan, Information } from '@vicons/carbon';
import { getImageUrl } from '../../helpers/helpers';
import { differenceInDays } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { camelCase } from 'lodash';
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';

const { t } = useI18n();
const message = useMessage();
const axios = injectStrict(AxiosKey);

const props = defineProps({
  category: { type: Object as PropType<Category>, required: true },
});

const filter = ref<Filter | undefined>(props.category.filters![0]);
const loading = ref(false);
const daysBeforeExpire = computed(() =>
  filter.value ? differenceInDays(new Date(filter.value.expirationDate), new Date()) + 1 : -1
);

const getBadgeType = () => {
  if (!filter.value) return 'default';

  switch (true) {
    case daysBeforeExpire.value >= 3:
      return 'success';

    case daysBeforeExpire.value < 3 && daysBeforeExpire.value > 0:
      return 'warning';

    case daysBeforeExpire.value <= 0:
      return 'error';
  }
};

const removeFilter = () => {
  if (!filter.value) return;

  loading.value = true;

  return axios
    .delete(`/filters/${filter.value.id}`)
    .then(() => {
      message.success('ok!');
      filter.value = undefined;
    })
    .catch((error) => {
      console.error(error);
      message.error('error');
    })
    .finally(() => (loading.value = false));
};

const renewFilter = async () => {
  loading.value = true;

  if (filter.value) await removeFilter();

  return axios
    .post<Filter>('/filters', {
      categoryId: props.category.id,
    })
    .then(({ data }) => {
      message.success('ok!');
      filter.value = data;
    })
    .catch((error) => {
      console.error(error);
      message.error('error');
    })
    .finally(() => (loading.value = false));
};
</script>

<template>
  <n-spin :show="loading">
    <n-card size="small" :style="{ height: '100%' }">
      <n-grid x-gap="12" :cols="4">
        <n-gi span="1">
          <n-image width="80" height="80" :src="getImageUrl(camelCase(category.name))" />
        </n-gi>
        <n-gi span="3">
          <n-space justify="space-between">
            <n-h3>
              <n-badge
                :type="getBadgeType()"
                :processing="!!filter"
                value="0"
                dot
                :color="filter ? undefined : 'grey'"
              />
              {{ category.name }}
            </n-h3>
            <n-tooltip>
              <template #trigger>
                <n-icon size="20" color="#00bfff">
                  <information />
                </n-icon>
              </template>
              {{ category.description }}
            </n-tooltip>
          </n-space>
          <n-descriptions v-if="filter" label-placement="left" :label-style="{ color: 'grey' }">
            <n-descriptions-item :label="t('filters.insertedAt')">
              <n-time :time="new Date(filter.createdAt)" format="dd/MM/yyyy" />
            </n-descriptions-item>
            <n-descriptions-item :label="t('filters.expiresIn')">
              <span v-if="daysBeforeExpire > 0" :style="{ color: daysBeforeExpire <= 3 ? '#efb700' : '' }">
                <n-number-animation :from="category.durationDays" :to="daysBeforeExpire" />
                {{ t('filters.days') }}
              </span>
              <span v-else style="color: red"> {{ t('filters.expired') }}! </span>
            </n-descriptions-item>
          </n-descriptions>
        </n-gi>
      </n-grid>

      <template #action>
        <n-space justify="end">
          <n-popconfirm @positive-click="removeFilter">
            <template #trigger>
              <n-button tertiary circle type="error" :disabled="!filter">
                <template #icon>
                  <n-icon><trash-can /></n-icon>
                </template>
              </n-button>
            </template>
            {{ t('filters.sureToRemove') }}
          </n-popconfirm>

          <n-popconfirm @positive-click="renewFilter">
            <template #trigger>
              <n-button tertiary circle type="primary">
                <template #icon>
                  <n-icon><renew /></n-icon>
                </template>
              </n-button>
            </template>
            {{ t('filters.sureToRenew') }}
          </n-popconfirm>
        </n-space>
      </template>
    </n-card>
  </n-spin>
</template>
