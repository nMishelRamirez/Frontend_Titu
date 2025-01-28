import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'stock-cell-renderer',
  standalone: true,
  template: `
    <div class="stock">
      <span>{{ stock }}</span>
      &nbsp;<span class="stockText">Stock</span>&nbsp;
    </div>

  `,
  styles: [
    `
      .stockText {
        opacity: 0.7;
      }
    `,
  ],
})
export class StockCellRenderer implements ICellRendererAngularComp {
 

  public value: string = '';
  public stock: number | string = '';

  agInit(params: ICellRendererParams): void {
    this.stock = params.data.stock;
  }

  refresh(params: ICellRendererParams): boolean {
    this.stock = params.data.stock;
    return true;
  }

}
