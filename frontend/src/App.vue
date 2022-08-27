<script setup lang="ts">
import { NConfigProvider, NMessageProvider, itIT, dateItIT } from 'naive-ui';
import DefaultLayout from './layouts/DefaultLayout.vue';
</script>

<template>
  <n-config-provider :locale="itIT" :date-locale="dateItIT">
    <n-message-provider>
      <default-layout />
    </n-message-provider>
  </n-config-provider>
</template>
