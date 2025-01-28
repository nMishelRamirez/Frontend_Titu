import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../../shared/data-access/base-http.service';
import { Observable } from 'rxjs';
import { Product } from '../../../../shared/interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseHttpService {
  getProducts(page: number, limit: number): Observable<{ products: Product[]; total: number }> {
    return this.http.get<{ products: any[]; total: number }>(`${this.apiUrl}/catalog/products`, {
      params: {
        limit: limit,
        offset: (page - 1) * limit,
      },
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/catalog/products/${id}`);
  }

  getProductsCategory(idCategory: string, page: number, limit: number): Observable<{ products: Product[]; total: number }> {
    return this.http.get<{ products: any[]; total: number }>(`${this.apiUrl}/catalog/categories/${idCategory}/products`, {
      params: {
        limit: limit,
        offset: (page - 1) * limit,
      },
    });
  }
}
