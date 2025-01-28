import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'image-cell-renderer',
  standalone: true,
  template: `
    <div class="productCell">
      <div class="image">
        <img [src]="image" alt="image" />
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

      .image {
        max-width: 100%;
        max-height: 100px;
        background-color: rgba(201, 201, 201, 0.2);
        border-radius: 8px;
        margin: 8px;
      }

      .image img {
        width: 60px;
        height: 60px;
      }

      .productCell div:first-child {
        font-weight: 500;
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
export class ImageCellRenderer implements ICellRendererAngularComp {
  public image: string = '';

  agInit(params: ICellRendererParams): void {
    this.image = params.data.image;
  }

  refresh(params: ICellRendererParams): boolean {
    this.image = params.data.image;
    return true;
  }
}


