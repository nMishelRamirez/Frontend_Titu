import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../main-page/main-page.component'),
  },
] as Routes;
