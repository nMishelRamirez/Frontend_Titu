import { Component, inject, OnInit } from '@angular/core';
import { SearchStateService } from '../../data-access/search-state.service';
import { CartStateService } from '../../../../../shared/data-access/cart-state.service';
import { Product } from '../../../../../shared/interfaces/product.interface';
import { ProductCardComponent } from '../../../products/ui/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-list',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export default class SearchListComponent implements OnInit {
  searchState = inject(SearchStateService);
  cartState = inject(CartStateService).state;

  // OBTENER EL QUERY STRING CON EL QUE SE ACCEDE
  // -----------------------------------
  // Inyectar ActivatedRoute para acceder al query string
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    // Obtener los parametros del query string de la URL
    this.activatedRoute.queryParams.subscribe(params => {
      const queryString = {
        query: params['query'] || '',
        sort: params['sort'] || '',
        lowPrice: params['low-price'] || '',
        highPrice: params['high-price'] || '',
      };
      this.searchState.setQueryString(queryString); // Pasar los parametros al servicio
    });
  }
  // -----------------------------------

  getMaxPages() {
    return Math.ceil(this.searchState.state.total() / this.searchState.state.limit());
  }

  goToPage(page: number) {
    // Cambiar de página
    this.searchState.changePage$.next(page);
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
    if (this.searchState.state.page() < this.getMaxPages()) {
      const page = this.searchState.state.page() + 1;
      this.searchState.changePage$.next(page);
    }
  }

  previousPage() {
    if (this.searchState.state.page() > 1) {
      const page = this.searchState.state.page() - 1;
      this.searchState.changePage$.next(page);
    }
  }

  addToCart(product: Product) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }
}
