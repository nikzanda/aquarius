<script setup lang="ts">
import axios from "axios";
import { reactive } from "vue";

interface Filter {
  id: number;
  name: string;
}

const filters = reactive<Filter[]>([]);

axios("http://localhost:8000/filters")
  .then(({ data }) => filters.push(...data))
  .catch(console.error);
</script>

<template>
  <h1>FILTRI</h1>
  <p>{{ filters }}</p>
</template>
