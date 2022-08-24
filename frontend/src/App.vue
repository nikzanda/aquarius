<script setup lang="ts">
import { RouterView } from 'vue-router'
import { itIT, dateItIT } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="itIT" :date-locale="dateItIT">
    <RouterView />
  </n-config-provider>
</template>
