import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { ProductService } from '../../../conectionBF/product.service';
import { ApiService } from '../../../conectionBF/api.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'actions-cell-renderer',
  standalone: true,
  template: `
    <div class="buttonCell">
      <button class="button-secondary buttonStopSelling" (click)="onRemoveClick()">
        <img src="/img/delete.svg" alt="delete" />
      </button>
      <button
    class="button-secondary buttonStopSelling"
    (click)="onEditClick()"
  >
    <img src="/img/update.svg" alt="update" />
  </button>
    </div>
  `,
  styles: [

    `
    .swal2-popup {
      font-family: 'Arial', sans-serif;
      font-size: 16px;
      padding: 1em;
    }
    
    .swal2-title {
      font-size: 24px;
      color: #333;
    }
    
    .swal2-content {
      color: #666;
    }
    
      .buttonCell {
        display: flex;
        gap: 8px;
        flex-direction: row-reverse;
      }

      .buttonCell button, a {
        appearance: none;
        display: inline-block;
        padding: 0.375em 1em 0.5em;
        white-space: nowrap;
        border-radius: 6px;
        box-shadow: 0 0 0 4px transparent, 0 1px 2px 0 #0c111d11;
        outline: none;
        background-color: var(--ag-background-color);
        color: var(--color-fg-primary, #101828);
        border: 1px solid var(--ag-border-color);
        cursor: pointer;
      }

      .removeButton {
        display: flex !important;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
      }

      .removeButton img {
        width: 20px;
      }

      .buttonStopSelling {
        height: 40px;
        line-height: 1.8;
      }
    `,
  ],
})
export class ActionsCellRenderer implements ICellRendererAngularComp {
  
  private params!: ICellRendererParams;

  constructor(private apiService: ApiService, private productService: ProductService) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  onRemoveClick(): void {
    const rowData = this.params.node.data;
    const productName = rowData.name;
    const categoryName = rowData.category;
  
    // Obtener el id del producto usando la nueva ruta
    this.apiService.getIdByNameCategory().subscribe({
      next: (products) => {
        // Filtrar el producto específico en el frontend por nombre y categoría
        const product = products.find(
          (p) => p.name === productName && p.category === categoryName
        );
  
        if (!product) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo encontrar el producto especificado.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          return;
        }
  
        const productId = product.id;
        console.log(productId);
  
        // Mostrar un modal de confirmación con SweetAlert2
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Este producto será eliminado permanentemente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.apiService.deleteProduct(productId).subscribe({
              next: () => {
                Swal.fire({
                  title: '¡Eliminado!',
                  text: 'Producto eliminado con éxito.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                });
                this.params.api.applyTransaction({ remove: [rowData] });
              },
              error: (err) => {
                console.error('Error al eliminar el producto:', err);
                Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al eliminar el producto. Intenta nuevamente.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              },
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener el producto por nombre y categoría:', err);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los productos. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
  
  
  
  onEditClick(): void {
    const rowData = this.params?.node?.data; // Verificación segura
  
    if (rowData) {
      console.log('Datos de la fila seleccionada:', rowData); // Confirmar qué datos se obtienen
      this.productService.setProduct(rowData); // Guardar datos en el servicio
      this.params.context.router.navigate(['/operator/update-product']); // Redirigir
    } else {
      console.error('No se encontraron datos en la fila seleccionada o es nulo.');
    }
  }
  

}