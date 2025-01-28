import { Component, inject, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ProductCategoryStateService } from '../../data-access/product-category-state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-category.component.html',
  providers: [ProductCategoryStateService],
})
export default class ProductCategoryComponent implements OnInit {
  productCategoryState = inject(ProductCategoryStateService);
  route = inject(ActivatedRoute);
  id: string = '';

  ngOnInit(): void {
    // Obtener el parámetro :id de la ruta
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.productCategoryState.categoryId$.next(this.id);
  }

  getMaxPages() {
    return Math.ceil(this.productCategoryState.state.total() / this.productCategoryState.state.limit());
  }

  goToPage(page: number) {
    // Cambiar de página
    this.productCategoryState.changePage$.next(page);
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
    if (this.productCategoryState.state.page() < this.getMaxPages()) {
      const page = this.productCategoryState.state.page() + 1;
      this.productCategoryState.changePage$.next(page);
    }
  }

  previousPage() {
    if (this.productCategoryState.state.page() > 1) {
      const page = this.productCategoryState.state.page() - 1;
      this.productCategoryState.changePage$.next(page);
    }
  }
}
