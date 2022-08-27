<script setup lang="ts">
import { NConfigProvider, itIT, dateItIT } from 'naive-ui';
import DefaultLayout from './layouts/DefaultLayout.vue';
</script>

<template>
  <n-config-provider :locale="itIT" :date-locale="dateItIT">
    <default-layout />
  </n-config-provider>
</template>
