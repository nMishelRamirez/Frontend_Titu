import { Routes } from '@angular/router';

export default [
  {
    path: ':id',
    loadComponent: () => import('../product-detail/product-detail.component'),
  },
  {
    path: 'category/:id',
    loadComponent: () => import('../product-category/product-category.component'),
  },
] as Routes;
