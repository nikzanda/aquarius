import { createRouter, createWebHistory } from 'vue-router';

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
      children: [
        {
          path: '',
          name: 'products.list',
          component: () => import('../products/ProductsList.vue'),
        },
        {
          path: 'new',
          name: 'products.create',
          component: () => import('../products/ProductCreate.vue'),
        },
        {
          path: ':id',
          name: 'products.update',
          component: () => import('../products/ProductUpdate.vue'),
        },
      ],
    },
    {
      path: '/refills',
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
