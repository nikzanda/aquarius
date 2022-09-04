<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { NLayout, NLayoutHeader, NLayoutContent, NMenu, type MenuOption, NIcon, NSwitch, NSpace } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { Filter, Sun, Moon, RainDrop } from '@vicons/carbon';
import { useI18n } from 'vue-i18n';
import type { Theme } from '@/types/types';
import { useThemeStore } from '@/stores/theme';

const { t } = useI18n();

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) });

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'filters',
          },
        },
        { default: t('filters.name') }
      ),
    key: 'filters',
    icon: renderIcon(Filter),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'refills',
          },
        },
        { default: t('refills.name') }
      ),
    key: 'refills',
    icon: renderIcon(RainDrop),
  },
];

const activeKey = ref<string | null>(null);
const themeStore = useThemeStore();
</script>

<template>
  <n-layout style="min-height: 100vh">
    <n-layout-header bordered>
      <n-space justify="space-between" align="center">
        <!-- <n-image width="50" height="40" :src="getImageUrl('aquarius')" /> -->
        <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
        <n-switch
          :value="themeStore.theme"
          checked-value="dark"
          unchecked-value="light"
          @update:value="(theme: Theme) => themeStore.setTheme(theme)"
        >
          <template #checked-icon>
            <n-icon>
              <moon />
            </n-icon>
          </template>
          <template #unchecked-icon>
            <n-icon>
              <sun />
            </n-icon>
          </template>
        </n-switch>
      </n-space>
    </n-layout-header>
    <n-layout-content content-style="padding: 15px;" :native-scrollbar="false">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>
