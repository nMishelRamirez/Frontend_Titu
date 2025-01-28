import { Component, input, output,inject,effect, EventEmitter, Output } from '@angular/core';
import { Product } from '../../../../../shared/interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { CartStateService } from '../../../../../shared/data-access/cart-state.service';
import { CommonModule } from '@angular/common';
import { ProductDetailSateService } from '../../data-access/proudct-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { CartItemComponent } from '../../../cart/ui/cart-item/cart-item.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styles: ``,
})
export class ProductCardComponent {

  product = input.required<Product>();

  addToCart = output<Product>();
  @Output() stockVerified = new EventEmitter<number>();

  add(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
    console.log('Producto agregado al carrito:', this.product());
  }

  // Función para verificar el stock del producto
  verifyStock() {
    const product = this.product();
    console.log('Producto:', product);
    if (!product) {
      console.error('Producto no encontrado');
      return;
    }
    const stock = product?.stock ?? 0; // Si stock es undefined, usamos 0
    console.log('Stock disponible:', stock);

    // Emitimos el valor de stock al componente padre
    this.stockVerified.emit(stock);
    console.log('Emitiendo el stock verificado:', stock);
    
    // Si el stock es 0, mostramos una alerta solo una vez
    if (stock === 0) {
      alert(`El producto ${product?.name} está agotado. No puede realizarse el pago.`);
    }
  }

  getInteger(value: number) {
    return Math.trunc(value);
  }

  getDecimal(value: number) {
    const decimal = (value % 1).toFixed(2).split('.')[1];
  // siempre dos dígitos
    return decimal.padStart(2, '0');
  }
}
