<script setup lang="ts">
import type { Category } from '@/types/models';
import type { PropType } from 'vue';
import { NSpace, NCard, NButton, NIcon, NTime, NImage, NPopconfirm, useMessage } from 'naive-ui';
import { DotMark, Renew, TrashCan } from '@vicons/carbon';
import { getImageUrl } from '../../helpers/helpers';
import { differenceInDays } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { camelCase } from 'lodash';
import axios from 'axios';

const { t } = useI18n();
const message = useMessage();

const props = defineProps({
  category: { type: Object as PropType<Category>, required: true },
});

const filter = props.category.filters![0];
const daysBeforeExpire = filter && differenceInDays(new Date(filter.expirationDate), new Date());

const getColor = () => {
  if (!filter) return 'grey';

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
  if (!filter) return;

  axios
    .patch(`http://localhost:8000/api/filters/${filter.id}`)
    .then(() => message.success('ok!'))
    .catch((error) => {
      console.error(error);
      message.error('error');
    });
};

const renewFilter = () => {
  axios
    .post('http://localhost:8000/api/filters', {
      categoryId: props.category.id,
    })
    .then(() => message.success('ok!'))
    .catch((error) => {
      console.error(error);
      message.error('error');
    });
};
</script>

<template>
  <n-card size="medium">
    <template #header>
      <n-image width="100" height="100" :src="getImageUrl(camelCase(category.name))" />
      <n-icon :color="getColor()">
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
</template>
