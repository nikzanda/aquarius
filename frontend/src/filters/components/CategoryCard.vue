<script setup lang="ts">
import type { Category } from '@/types/models';
import type { PropType } from 'vue';
import { NSpace, NCard, NButton, NIcon, NTime, NImage } from 'naive-ui';
import { DotMark } from '@vicons/carbon';
import { getImageUrl } from '../../helpers/helpers';
import { differenceInDays } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { camelCase } from 'lodash';

const { t } = useI18n();

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
        <n-button type="primary">test</n-button>
        <n-button type="primary">test</n-button>
      </n-space>
    </template>
  </n-card>
</template>
