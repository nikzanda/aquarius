import { defineStore } from 'pinia';
import type { Refill } from '@/types/models';
import { ref } from 'vue';
import { injectStrict } from '@/helpers/injectTypes';
import { AxiosKey } from '@/symbols';

interface RefillUpdate {
  productId: number;
}

export const useRefillStore = defineStore('refill', () => {
  const axios = injectStrict(AxiosKey);

  const lastRefill = ref<Refill | undefined>(undefined);
  const refills = ref<Refill[]>([]);
  const count = ref(0);

  const getLastRefill = () => {
    return axios('/refills/last')
      .then(({ data }) => {
        lastRefill.value = data;
        return data;
      })
      .catch(Promise.reject);
  };

  const updateLastRefill = (payload: RefillUpdate) => {
    if (!lastRefill.value) {
      return Promise.reject('no-refill');
    }

    return axios
      .patch(`/refills/${lastRefill.value.id}`, payload)
      .then(({ data }) => {
        getLastRefill();
        return data;
      })
      .catch(Promise.reject);
  };

  const createRefill = () => {
    return axios
      .post('/refills', undefined, {
        params: {
          include: 'products',
        },
      })
      .then(({ data }) => {
        lastRefill.value = data;
        window.$message.success('ok!');
        return data;
      })
      .catch(Promise.reject);
  };

  return {
    lastRefill,
    refills,
    count,
    getLastRefill,
    updateLastRefill,
    createRefill,
  };
});
