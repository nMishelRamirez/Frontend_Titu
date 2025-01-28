import { inject, Injectable } from '@angular/core';
import { Category } from '../../../../shared/interfaces/category.interface';
import { signalSlice } from 'ngxtension/signal-slice';
import { CategoryService } from './category.service';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

interface State {
  categories: Category[];
  status: 'loading' | 'success' | 'error';
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryStateService {
  private categoryService = inject(CategoryService);
  private limit = 20;

  private initialState: State = {
    categories: [],
    status: 'loading' as const,
    page: 1,
    limit: this.limit,
  }

  changePage$ = new Subject<number>();

  loadCategories$ = this.changePage$.pipe(
    startWith(1),
    switchMap((page) => 
      this.categoryService.getCategories(page, this.limit)
    ),
    map((response) => ({
      categories: response,
      status: 'success' as const,
    })),
    catchError(() => {
      return of({
        categories: [],
        status: 'error' as const,
      });
    }),
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.changePage$.pipe(
        map((page) => ({ page, status: 'loading' as const })),
      ),
      this.loadCategories$,
    ],
  });
}
