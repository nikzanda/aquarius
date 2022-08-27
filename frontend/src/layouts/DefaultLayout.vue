<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { NLayout, NLayoutHeader, NLayoutContent, NMenu, type MenuOption, NIcon } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { Filter } from '@vicons/carbon';

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
        { default: 'Filtri' }
      ),
    key: 'filters',
    icon: renderIcon(Filter),
  },
];

const activeKey = ref<string | null>(null);
</script>

<template>
  <n-layout style="min-height: 100vh">
    <n-layout-header bordered>
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    </n-layout-header>
    <n-layout-content content-style="padding: 15px;" :native-scrollbar="false">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>
