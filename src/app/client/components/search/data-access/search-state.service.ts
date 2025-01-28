import { inject, Injectable } from '@angular/core';
import { SearchService } from './search.service';
import { Product } from '../../../../shared/interfaces/product.interface';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { signalSlice } from 'ngxtension/signal-slice';
import { QueryString } from '../shared/interfaces/query-string.interface';

interface State {
  products: Product[];
  status: 'loading' | 'success' | 'error';
  total: number;
  maxPrice: number;
  page: number;
  limit: number;
  queryString: QueryString;
}

@Injectable()
export class SearchStateService {
  private searchService = inject(SearchService);
  private limit = 8;

  private initialState: State = {
    products: [],
    status: 'loading' as const,
    total: 0,
    maxPrice: 100,
    page: 1,
    limit: this.limit,
    queryString: {
      query: '',
      sort: '',
      lowPrice: '',
      highPrice: '',
    },
  };

  // Subject para las paginas
  changePage$ = new Subject<number>();

  // Subject para parametros de query string
  queryString$ = new Subject<QueryString>();

  // Cambiar el searchQuery y hacer una recarga de los productos
  setQueryString(queryString: QueryString) {
    this.queryString$.next(queryString);
  } 

  loadProducts$ = this.queryString$.pipe(
    switchMap((queryString) => 
      this.changePage$.pipe(
        startWith(1),
        switchMap((page) => 
          this.searchService.getSearchedProducts(page, queryString, this.limit)
        )
      )
    ),
    map((response) => ({ 
      products: response.products, 
      status: 'success' as const, 
      total: response.total,
      maxPrice: response.maxPrice
    })),
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
      this.queryString$.pipe(
        map((queryString) => ({ page: 1, queryString: queryString }))
      ),
      this.loadProducts$,
    ],
  });
}
