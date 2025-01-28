// src/app/services/product.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Usaremos BehaviorSubject para compartir el estado

@Injectable({
  providedIn: 'root'  // Hacemos que el servicio esté disponible globalmente
})
export class ProductService {
  private productSubject = new BehaviorSubject<any>(null);  // Almacenamos el producto seleccionado

  // Observable que otros componentes pueden suscribirse
  product$ = this.productSubject.asObservable();

  constructor() {}

  // Método para actualizar el producto
  setProduct(product: any): void {
    this.productSubject.next(product);  // Establece el nuevo valor del producto
  }

  // Método para obtener el producto actual (opcional)
  getProduct(): any {
    return this.productSubject.value;  // Retorna el valor actual del producto
  }
}
