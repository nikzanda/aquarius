<script setup lang="ts">
import axios from "axios";
import { reactive } from "vue";
import { NSpace, NCard, NRow, NButton, NIcon, NTime } from 'naive-ui'
import { DotMark } from '@vicons/carbon'
import type { Category } from "@/types/models";

const categories = reactive<Category[]>([]);

axios("http://localhost:8000/categories")
  .then(({ data }) => categories.push(...data))
  .catch(console.error);
</script>

<template>
  <n-row>
    <h1>FILTRI</h1>

    <n-space>
      <n-card v-for="category in categories" :key="category.id" size="medium">
        <template #header>
          <!-- <n-space align="baseline"> -->
<n-icon color="red">
            <dot-mark />
          </n-icon>
          <strong>{{category.name}}</strong>
          <!-- </n-space> -->
        </template>
        <!-- {{category.description}} -->
        <n-space vertical>
          <span>Inserito il <n-time format="dd-MM-yyyy" /></span>
          <span>Scade il <n-time format="dd-MM-yyyy" /></span>
        </n-space>
        <template #action>
          <n-space justify="end">
          <n-button type="primary">test</n-button>
          <n-button type="primary">test</n-button>
          </n-space>
        </template>
      </n-card>
    </n-space>
  </n-row>
</template>
