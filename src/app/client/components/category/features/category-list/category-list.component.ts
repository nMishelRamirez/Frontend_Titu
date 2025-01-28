import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryStateService } from '../../data-access/category-state.service';

@Component({
  selector: 'app-category-list',
  imports: [NgFor, NgClass, RouterLink],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  categoriesState = inject(CategoryStateService);

  currentIndex = 0;
  toFordware = true;
  toBackware = false;

  get isFirstSlide(): boolean {
    return this.currentIndex === 0;
  }

  get isLastSlide(): boolean {
    return this.currentIndex === this.categoriesState.state().categories.length - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  nextSlide(): void {
    this.toFordware = true;
    this.toBackware = false;
    if (!this.isLastSlide) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Vuelve al primer slide
    }
  }

  previousSlide(): void {
    this.toFordware = false;
    this.toBackware = true;
    if (!this.isFirstSlide) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.categoriesState.state().categories.length - 1; // Vuelve al último slide
    }
  }

  // Funciones para movimiento de tarjetas
  nextNumber(actual: number): number {
    if(this.isLastSlide) return 0;
    return actual+1;
  }

  previousNumber(actual: number): number {
    if(this.isFirstSlide) return this.categoriesState.state().categories.length - 1;;
    return actual-1;
  }
}
