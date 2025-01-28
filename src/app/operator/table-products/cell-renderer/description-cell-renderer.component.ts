
import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'description-cell-renderer',
  standalone: true,
  template: `
    <div class="productCell">
      <div>
        <div>{{ value }}</div>
        <div class="stockCell">{{ description }}</div>
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
        justify-content: center;
      }

      .productCell div:first-child {
        font-weight: 500;
      }
       /* Eliminar la negrilla */
       .productCell div:first-child {
        font-weight: normal; /* Cambiar de 500 a normal para quitar la negrilla */
      }

      .productCell div {
        padding-bottom: 0;
        line-height: 1.5;
      }

      .productCell img {
        border-radius: 8px;
      }
    `,
  ],
})
export class DescriptionCellRenderer implements ICellRendererAngularComp {
  public value: string = '';
  public description: string = '';

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.description = params.data.product;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.description = params.data.product;
    return true;
  }
}
