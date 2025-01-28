import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProductsSateService } from '../../data-access/products-state.service';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CartStateService } from '../../../../../shared/data-access/cart-state.service';
import { Product } from '../../../../../shared/interfaces/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  providers: [ProductsSateService],
})
export default class ProductListComponent {
  productsState = inject(ProductsSateService);
  cartState = inject(CartStateService).state;

  getMaxPages() {
    return Math.ceil(this.productsState.state.total() / this.productsState.state.limit());
  }

  goToPage(page: number) {
    // Cambiar de página
    this.productsState.changePage$.next(page);
  }

  // Función para generar un array de páginas
  getPages(maxPages: number): number[] {
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  }

  // Función para generar un array de páginas iniciales
  getInitialPages(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  // Función para generar un array de páginas intermedias
  getIntermediatePages(page: number): number[] {
    return Array.from({ length: 3 }, (_, i) => page - 1 + i);
  }

  // Función para generar un array de páginas finales
  getLastPages(maxPages: number): number[] {
    return Array.from({ length: 5 }, (_, i) => maxPages - 4 + i);
  }

  nextPage() {
    if (this.productsState.state.page() < this.getMaxPages()) {
      const page = this.productsState.state.page() + 1;
      this.productsState.changePage$.next(page);
    }
  }

  previousPage() {
    if (this.productsState.state.page() > 1) {
      const page = this.productsState.state.page() - 1;
      this.productsState.changePage$.next(page);
    }
  }

  addToCart(product: Product) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }
}
