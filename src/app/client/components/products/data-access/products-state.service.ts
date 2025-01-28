import { Injectable, inject } from '@angular/core';
import { Product } from '../../../../shared/interfaces/product.interface';
import { signalSlice } from 'ngxtension/signal-slice';
import { ProductsService } from './products.service';
import { Subject, catchError, map, of, startWith, switchMap } from 'rxjs';

interface State {
  products: Product[];
  status: 'loading' | 'success' | 'error';
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ProductsSateService {
  private productsService = inject(ProductsService);
  private limit = 8;

  private initialState: State = {
    products: [],
    status: 'loading' as const,
    total: 0,
    page: 1,
    limit: this.limit,
  };

  changePage$ = new Subject<number>();

  loadProducts$ = this.changePage$.pipe(
    startWith(1),
    switchMap((page) => this.productsService.getProducts(page, this.limit)),
    map((response) => ({ products: response.products, status: 'success' as const, total: response.total })),
    catchError(() => {
      return of({
        products: [],
        status: 'error' as const,
        total: 0,
      });
    }),
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.changePage$.pipe(
        map((page) => ({ page, status: 'loading' as const })),
      ),
      this.loadProducts$,
    ],
  });
}
