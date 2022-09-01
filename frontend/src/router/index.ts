import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/filters',
    },
    {
      path: '/filters',
      name: 'filters',
      component: () => import('../filters/FiltersList.vue'),
    },
    {
      path: '/refills',
      name: 'refills',
      component: () => import('../refills/RefillsList.vue'),
    },
  ],
});

export default router;
