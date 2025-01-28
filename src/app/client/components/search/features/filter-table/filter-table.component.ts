import { Component, inject, OnInit } from '@angular/core';
import { PriceRangeComponent } from './price-range/price-range.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchStateService } from '../../data-access/search-state.service';

@Component({
  selector: 'app-filter-table',
  imports: [PriceRangeComponent],
  templateUrl: './filter-table.component.html',
  styleUrl: './filter-table.component.css'
})
export class FilterTableComponent {
  searchState = inject(SearchStateService);
  
  private activatedRoute = inject(ActivatedRoute);
  query: string = '';
  sort: string = '';
  lowPrice: string = '';
  highPrice: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.sort = params['sort'] || '';
      this.lowPrice = params['low-price'] || '';
      this.highPrice = params['high-price'] || '';

      console.log({
        query: this.query,
        sort: this.sort,
        lowPrice: this.lowPrice,
        highPrice: this.highPrice,
      });
    });
  }

  handlePriceRange(event: { minPrice: string; maxPrice: string }) {
    this.lowPrice = event.minPrice;
    this.highPrice = event.maxPrice;

    // Construir un objeto de parámetros dinámico
    const queryParams: { [key: string]: string } = {};

    if (this.query.trim()) {
      queryParams['query'] = this.query.trim();
    }
    if (this.sort.trim()) {
      queryParams['sort'] = this.sort.trim();
    }
    if (this.lowPrice.trim()) {
      queryParams['low-price'] = this.lowPrice.trim();
    }
    if (this.highPrice.trim()) {
      queryParams['high-price'] = this.highPrice.trim();
    }

    // Navegar con los parámetros dinámicos
    this.router.navigate(['/search'], { queryParams });
  }

  handleOrderBy(order: string) {
    // Construir un objeto de parámetros dinámico
    const queryParams: { [key: string]: string } = {};

    if (this.query.trim()) {
      queryParams['query'] = this.query.trim();
    }
    if (order.trim()) {
      queryParams['sort'] = order.trim();
    }
    if (this.lowPrice.trim()) {
      queryParams['low-price'] = this.lowPrice.trim();
    }
    if (this.highPrice.trim()) {
      queryParams['high-price'] = this.highPrice.trim();
    }

    // Navegar con los parámetros dinámicos
    this.router.navigate(['/search'], { queryParams });
  }
}
