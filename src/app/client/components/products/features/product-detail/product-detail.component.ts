import { Component, effect, inject, input, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailSateService } from '../../data-access/proudct-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../../../shared/data-access/cart-state.service';
import { RouterLink } from '@angular/router';
import { CartItemComponent } from '../../../cart/ui/cart-item/cart-item.component';
import { ProductCardComponent } from '../../ui/product-card/product-card.component'; 

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product-detail.component.html',
  providers: [ProductDetailSateService],
})

export default class ProductDetailComponent {
  productDetailState = inject(ProductDetailSateService).state;
  cartState = inject(CartStateService).state;

  id = input.required<string>();

  // Contador de cantidad agregada al carrito
  quantityToAdd = 0;

  constructor() {
    effect(() => {
      this.productDetailState.getById(this.id());
      // Al cargar el producto, obtenemos el contador del localStorage
      const storedQuantity = localStorage.getItem(`quantityToAdd_${this.id()}`);
      //this.resetQuantityOnRemove(this.id());  // Restablecemos el contador en el componente anterior
      console.log('Contador de agregado:', storedQuantity);
      
      /*if (storedQuantity) {
        this.quantityToAdd = parseInt(storedQuantity, 10);
        console.log('Contador de agregado obtenido:', this.quantityToAdd);
      }*/
    });
  }
  
  // Función para manejar el evento de stock verificado
  onStockVerified(stock: number) {
    console.log('Stock recibido desde ProductCardComponent:', stock);
    
    // Aquí puedes manejar el stock recibido, como mostrar un mensaje o realizar alguna acción adicional.
    if (stock === 0) {
      alert('Este producto está agotado.');
    }
  }

  // Función para agregar al carrito incrementando la cantidad con cada clic
  addToCart() {
    const product = this.productDetailState.product();
    const stock = product?.stock ?? 0;  // Si stock es undefined, usa 0
    console.log('Stock disponible:', stock);
    
    // Aseguramos que el stock disponible es suficiente para agregar más productos
    if (product && this.quantityToAdd < stock) {
      // Incrementamos la cantidad agregada
      this.quantityToAdd++;

      // Guardamos el contador actualizado en localStorage
      localStorage.setItem(`quantityToAdd_${this.id()}`, this.quantityToAdd.toString());

      this.cartState.add({
        product: this.productDetailState.product()!,
        quantity: 1,  // Aquí siempre estamos agregando 1 unidad por cada clic
      });

      console.log(`${this.quantityToAdd} de ${product?.name} agregado(s) al carrito.`);

    } else if (this.quantityToAdd >= stock) {
      // Si la cantidad alcanzó el stock disponible
      alert(`Solo hay ${stock} unidades disponibles de ${product?.name}.`);
      //this.resetQuantityOnRemove(this.id());  // Restablecemos el contador en el componente anterior
    }
    
  }

  // Función para resetear la cantidad en ProductDetailComponent cuando el producto es eliminado del carrito
  resetQuantityOnRemove(productId: string) {
    if (this.id() === productId) {
      this.quantityToAdd = 0;
      localStorage.setItem(`quantityToAdd_${this.id()}`, '0');  // Restablecemos el contador en localStorage
      console.log('Restablecido el contador de agregado:', this.quantityToAdd);
    }
  }


}
