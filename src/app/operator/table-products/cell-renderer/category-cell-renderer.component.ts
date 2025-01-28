import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'category-cell-renderer',
  standalone: true,
  template: `
    <div class="productCell">
      <div class="image">
      </div>
      <div>
        <div class="stockCell">{{ category }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .productCell {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start; /* Alineación al principio para ocupar menos espacio */
        width: auto; /* Esto hace que ocupe solo el espacio necesario */
      }

      /* Eliminar la negrilla */
      .productCell div:first-child {
        font-weight: normal; /* Cambiar de 500 a normal para quitar la negrilla */
      }

      .productCell div {
        padding-bottom: 0;
        line-height: 1.5;
        margin-right: 5px; /* Añadir un poco de margen para separarlo de la siguiente columna */
      }

      .productCell img {
        border-radius: 8px;
      }

      /* Puedes agregar más ajustes si deseas que la categoría se vea más compacta */
      .stockCell {
        white-space: nowrap; /* Evitar el salto de línea */
        overflow: hidden; /* Ocultar cualquier texto que se desborde */
        text-overflow: ellipsis; /* Mostrar "..." si el texto se desborda */
      }
    `,
  ],
})
export class CategoryCellRenderer implements ICellRendererAngularComp {
  public value: string = '';
  public category: string = '';

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.category = params.data.category;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.category = params.data.category;
    return true;
  }
}
