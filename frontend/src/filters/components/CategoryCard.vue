<script setup lang="ts">
import type { Category, Filter } from '@/types/models';
import { ref, type PropType } from 'vue';
import { NSpace, NCard, NButton, NIcon, NTime, NImage, NPopconfirm, NSpin, useMessage } from 'naive-ui';
import { DotMark, Renew, TrashCan } from '@vicons/carbon';
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
const daysBeforeExpire = filter.value ? differenceInDays(new Date(filter.value.expirationDate), new Date()) : -1;

const getLightColor = () => {
  if (!filter.value) return 'grey';

  switch (true) {
    case daysBeforeExpire >= 3:
      return 'green';

    case daysBeforeExpire < 3 && daysBeforeExpire > 0:
      return 'yellow';

    case daysBeforeExpire <= 0:
      return 'red';
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
      console.log(data);
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
    <n-card size="medium">
      <template #header>
        <n-image width="100" height="100" :src="getImageUrl(camelCase(category.name))" />
        <n-icon :color="getLightColor()">
          <dot-mark />
        </n-icon>
        <strong>{{ category.name }}</strong>
      </template>
      <n-space vertical>
        <template v-if="filter">
          <span> {{ t('filters.insertedAt') }} <n-time :time="new Date(filter.createdAt)" format="dd-MM-yyyy" /> </span>
          <span>
            {{ t('filters.expiresIn', { days: daysBeforeExpire }) }}
          </span>
        </template>
      </n-space>
      <template #action>
        <n-space justify="end">
          <n-popconfirm @positive-click="() => removeFilter()">
            <template #trigger>
              <n-button tertiary circle type="error" :disabled="!filter">
                <template #icon>
                  <n-icon><trash-can /></n-icon>
                </template>
              </n-button>
            </template>
            {{ t('filters.sureToRemove') }}
          </n-popconfirm>

          <n-popconfirm @positive-click="() => renewFilter()">
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
