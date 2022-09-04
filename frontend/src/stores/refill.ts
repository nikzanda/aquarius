import { defineStore } from 'pinia';
import type { Refill } from '@/types/models';
import { ref } from 'vue';
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';

export const useRefillStore = defineStore('refill', () => {
  const axios = injectStrict(AxiosKey);

  const lastRefill = ref<Refill | undefined>(undefined);
  const refills = ref<Refill[]>([]);
  const count = ref(0);

  const getLastRefill = () => {
    axios('/refills/last')
      .then(({ data }) => (lastRefill.value = data))
      .catch(Promise.reject);
  };

  return {
    lastRefill,
    refills,
    count,
    getLastRefill,
  };
});
