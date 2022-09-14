<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  type MenuOption,
  NIcon,
  NSwitch,
  NSpace,
  useMessage,
} from 'naive-ui';
import { h, ref, watch, type Component } from 'vue';
import { Filter, Sun, Moon, RainDrop, Product, Fish, Eyedropper } from '@vicons/carbon';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@/stores/theme';

const { t } = useI18n();
const route = useRoute();
const activeKey = ref<string | null>(null);
const themeStore = useThemeStore();

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) });

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'home',
          },
        },
        { default: t('home.name') }
      ),
    key: 'home',
    icon: renderIcon(Fish),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'filters.list',
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
            name: 'products.list',
          },
        },
        { default: t('products.name') }
      ),
    key: 'products',
    icon: renderIcon(Product),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'tests.list',
          },
        },
        { default: t('tests.name') }
      ),
    key: 'tests',
    icon: renderIcon(Eyedropper),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'refills.list',
          },
        },
        { default: t('refills.name') }
      ),
    key: 'refills',
    icon: renderIcon(RainDrop),
  },
];

watch(
  () => route.name,
  (routeName) => {
    activeKey.value = routeName ? (routeName as string).split('.')[0] : null;
  }
);

window.$message = useMessage();
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
          @update:value="(theme) => themeStore.setTheme(theme)"
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
