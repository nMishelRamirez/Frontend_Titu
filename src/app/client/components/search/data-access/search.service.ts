import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../../shared/data-access/base-http.service';
import { Observable } from 'rxjs';
import { Product } from '../../../../shared/interfaces/product.interface';
import { QueryString } from '../shared/interfaces/query-string.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService extends BaseHttpService {
  getSearchedProducts(page: number, queryString: QueryString, limit: number): Observable<{ products: Product[]; total: number; maxPrice: number }> {
    // Construir un objeto de parámetros dinámico
    const params: { [key: string]: string | number } = {};

    if (queryString.query.trim()) {
      params['query'] = queryString.query.trim();
    }
    if (queryString.sort.trim()) {
      params['sort'] = queryString.sort.trim();
    }
    if (queryString.lowPrice.trim()) {
      params['lowPrice'] = queryString.lowPrice.trim();
    }
    if (queryString.highPrice.trim()) {
      params['highPrice'] = queryString.highPrice.trim();
    }

    params['limit'] = limit;
    params['offset'] = (page - 1) * limit;

    return this.http.get<{ products: any[]; total: number; maxPrice: number }>(`${this.apiUrl}/catalog/products/search`, { params: params });
  }
}
