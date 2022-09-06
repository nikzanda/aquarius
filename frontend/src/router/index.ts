import { createRouter, createWebHistory } from 'vue-router';
import { RouterView } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'home',
      component: () => import('../home/HomePage.vue'),
    },
    {
      path: '/filters',
      component: () => RouterView,
      children: [
        {
          path: '',
          name: 'filters.list',
          component: () => import('../filters/FiltersList.vue'),
        },
      ],
    },
    {
      path: '/products',
      component: () => RouterView,
      children: [
        {
          path: '',
          name: 'products.list',
          component: () => import('../products/ProductsList.vue'),
        },
        {
          path: 'create',
          name: 'products.create',
          component: () => import('../products/ProductCreate.vue'),
        },
      ],
    },
    {
      path: '/refills',
      component: () => RouterView,
      children: [
        {
          path: '',
          name: 'refills.list',
          component: () => import('../refills/RefillsList.vue'),
        },
      ],
    },
  ],
});

export default router;
