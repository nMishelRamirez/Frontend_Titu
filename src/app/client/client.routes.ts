import { Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { authGuard } from '../shared/guards/auth.guard';

export default [
  {
    path: '',
    component: ClientComponent,
    loadChildren: () => import('./components/home/home.routes')
  },
  { 
    path: 'cart', 
    component: ClientComponent,
    loadChildren: () => import('./components/cart/cart.routes'),
    canActivate: [authGuard]
  },
  { 
    path: 'products', 
    component: ClientComponent,
    loadChildren: () => import('./components/products/features/product-shell/product.route') 
  },
  { 
    path: 'search', 
    component: ClientComponent,
    loadChildren: () => import('./components/search/features/search-shell/search.routes') 
  },
  { 
    path: 'payment-process', 
    component: ClientComponent,
    loadChildren: () => import('../payment/payment-shell/payment.routes'),
    canActivate: [authGuard]
  },
] as Routes;
