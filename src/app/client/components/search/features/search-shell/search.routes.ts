import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../search-page/search-page.component'),
  },
] as Routes;
