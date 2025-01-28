import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../conectionBF/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
//import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-tabla',
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css'
})
export class TablaComponent implements OnInit{

  displayedColumns: string[] = ['name', 'category', 'description', 'price', 'stock', 'image']; // Define las columnas
  productos: any[] = []; // Datos para la tabla

  constructor(private productService: ApiService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Productos recibidos:', data); // Para verificar en consola
        this.productos = data; // Asigna los datos recibidos
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }
}
