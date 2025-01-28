import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../../shared/data-access/base-http.service';
import { Observable } from 'rxjs';
import { Category } from '../../../../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseHttpService {

  getCategories(page: number, limit: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/catalog/categories`, {
      params: {
        limit: limit,
        offset: (page - 1) * limit,
      },
    });
  }

}
