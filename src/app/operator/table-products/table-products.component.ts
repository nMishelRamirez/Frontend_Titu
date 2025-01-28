import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../conectionBF/api.service'; // Importamos el servicio de conexión a la base de datos
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import type {
  ColDef,
  GetDetailRowDataParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SizeColumnsToFitGridStrategy,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  ExcelExportModule,
  MasterDetailModule,
  MultiFilterModule,
  SetFilterModule,
} from 'ag-grid-enterprise';

import { TablaComponent } from '../tabla/tabla.component';
import { ProductCellRenderer } from './cell-renderer/product-cell-renderer.component';
import { ImageCellRenderer } from './cell-renderer/image-cell-renderer.component'; // O ajusta los renderizadores
import { StockCellRenderer } from './cell-renderer/stock-cell-renderer.component';
import { PriceCellRenderer } from './cell-renderer/price-cell-renderer.component';
import { ActionsCellRenderer } from './cell-renderer/actions-cell-renderer.component';
import { CategoryCellRenderer } from './cell-renderer/category-cell-renderer.component';
import { DescriptionCellRenderer } from './cell-renderer/description-cell-renderer.component';


ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  SetFilterModule,
  MultiFilterModule,
  MasterDetailModule,
]);

const statuses = {
  all: 'Todos',
  active: 'Active',
  paused: 'On Hold',
  outOfStock: 'Out of Stock',
};

const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[value as keyof typeof statuses] ?? '';


@Component({
  selector: 'app-table-products',
  standalone: true,
  imports: [AgGridAngular,
    FormsModule,
  ],
  templateUrl: './table-products.component.html',
  styleUrl: './table-products.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class TableProductsComponent {

  @Input() gridTheme: string = 'ag-theme-quartz';
  @Input() isDarkMode: boolean = false;

  product: any;

  private gridApi!: GridApi;

  constructor(private productService: ApiService, public router: Router) {}


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data); // Verifica que los datos se carguen correctamente
        this.productos = data;
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }


  themeClass = `${this.gridTheme}${this.isDarkMode ? '-dark' : ''}`;
  theme: GridOptions['theme'] = 'legacy';

  productos: any[] = [];

  columnDefs = [
    {
      field: 'name',
      headerName: 'Nombre',
      cellRenderer: 'agGroupCellRenderer',
      headerClass: 'header-product',
      cellRendererParams: {
        innerRenderer: ProductCellRenderer,
      },
      minWidth: 300,
    },
    {
      field: 'category',
      headerName: 'Categoria',
      cellRenderer: 'agGroupCellRenderer',
      headerClass: 'header-inventory',
      cellRendererParams: {
        innerRenderer: CategoryCellRenderer,
      },
      minWidth: 20,
    },
    {
      field: 'description',
      headerName: 'Descripción',
      cellRenderer: 'agGroupCellRenderer',
      headerClass: 'header-description',
      cellRendererParams: {
        innerRenderer: DescriptionCellRenderer,
      },
      minWidth: 500,
    },
    {
      headerName: 'Stock',
      field: 'stock',
      cellRenderer: 'agGroupCellRenderer',
      headerClass: 'header-inventory',
      cellRendererParams: {
        innerRenderer: StockCellRenderer,
      },

    },
    {
      headerName: 'Precio',
      field: 'price',
      width: 120,
      headerClass: 'header-price',
      cellRenderer: PriceCellRenderer,
    },
    {
      headerName: 'Imagen',
      headerClass: 'header-price',
      cellRenderer: ImageCellRenderer,
      width: 150,
    },
    { field: 'Acciones', cellRenderer: ActionsCellRenderer, minWidth: 194 },
  ];
  defaultColDef: ColDef = {
    resizable: false,
  };
  autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: 'fitGridWidth',
  };

  rowHeight = 80;
  paginationPageSizeSelector = [5, 10, 20];
  pagination = true;
  paginationPageSize = 10;
  masterDetail = false;
  detailRowAutoHeight = true;

  // Configuración del texto de los componentes de ag-Grid
  gridOptions = {
    localeText: {
      pageSize: 'Tamaño de página', // Cambia "Page Size" a "Tamaño de página"
      page: 'Página',
      more: 'Más',
      to: 'a',
      of: 'de',
    }
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi = params.api;

    // Pasar el router al contexto
    (params.api as any).context = {
      ...(params.api as any).context,
      router: this.router, // Esto asegura que el Router esté disponible en el contexto
    };
  }

  statusEntries = Object.entries(statuses);
  activeTab = 'all';
  quickFilterText = '';

  handleTabClick(status: string) {
    this.gridApi.setColumnFilterModel(
      'status',
      status === 'all' ? null : { values: [status] }
    );
    this.gridApi.onFilterChanged();
    this.activeTab = status;
  }

  onAddClick(): void {
    this.gridApi.applyTransaction({ add: [this.product] });
  }
}
