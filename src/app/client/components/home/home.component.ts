import { Component } from '@angular/core';
import { CategoryListComponent } from '../category/features/category-list/category-list.component';
import ProductListComponent from '../products/features/product-list/product-list.component';

@Component({
  selector: 'app-home',
  imports: [CategoryListComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {

}
