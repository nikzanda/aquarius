<script setup lang="ts">
import { NConfigProvider, NMessageProvider, itIT, dateItIT, darkTheme, lightTheme } from 'naive-ui';
import { computed } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useThemeStore } from './stores/theme';

const themeStore = useThemeStore();
const theme = computed(() => (themeStore.theme === 'light' ? lightTheme : darkTheme));
</script>

<template>
  <n-config-provider :locale="itIT" :date-locale="dateItIT" :theme="theme">
    <n-message-provider>
      <default-layout />
    </n-message-provider>
  </n-config-provider>
</template>
