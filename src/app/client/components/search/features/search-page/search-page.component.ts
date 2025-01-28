import { Component } from '@angular/core';
import SearchListComponent from '../search-list/search-list.component';
import { FilterTableComponent } from "../filter-table/filter-table.component";

@Component({
  selector: 'app-search-page',
  imports: [SearchListComponent, FilterTableComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export default class SearchPageComponent {

}
