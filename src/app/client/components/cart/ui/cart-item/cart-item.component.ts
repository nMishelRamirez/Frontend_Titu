import { Component, input, output, EventEmitter, Output } from '@angular/core';
import { ProductItemCart } from '../../../../../shared/interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  productCartItem = input.required<ProductItemCart>();

  //onRemove = output<string>();

  onIncrease = output<ProductItemCart>();

  
  onDecrease = output<ProductItemCart>();

  @Output() onRemove = new EventEmitter<string>();

  increaseQuantity(cartItem: any) {
    if (cartItem.quantity < cartItem.product.stock) {
      cartItem.quantity++;
    } else {
      alert('No hay suficiente stock');
    }
  }

  // Propiedades para controlar el proceso de eliminación
  isRemoving = false;
  productToRemove: any; // Producto que se está "eliminando"
  timer: any; // Referencia al temporizador
  remainingTime = 3; // Contador de 3 segundos

  // Método para manejar la acción de eliminar el producto
  onRemoveProduct(productId: string) {
    // Marca el producto para ser eliminado
    this.isRemoving = true;
    this.productToRemove = productId;
    this.remainingTime = 3; // Reinicia el tiempo a 3 segundos

    // Inicia el contador de 3 segundos
    this.timer = setInterval(() => {
      this.remainingTime--; // Decrementa el tiempo
      if (this.remainingTime <= 0) {
        this.finalizeRemoval(productId); // Si el tiempo se acaba, elimina el producto
      }
    }, 1000); // Decrementa el tiempo cada segundo
  }

  // Método para finalizar la eliminación del producto
  finalizeRemoval(productId: string) {
    clearInterval(this.timer); // Detiene el temporizador
    this.onRemove.emit(productId); // Emite el ID del producto para eliminarlo
    this.isRemoving = false; // Oculta el botón de deshacer
    this.remainingTime = 0; // Resetea el contador a 0
    // Evento de eliminación del producto 
    console.log('Evento de eliminación del producto:', productId);
  }

  // Método para deshacer la eliminación
  undoRemove() {
    clearInterval(this.timer); // Cancela el temporizador
    this.isRemoving = false; // Oculta el botón de deshacer
    this.productToRemove = null; // Restablece el estado
    this.remainingTime = 0; // Resetea el contador a 0
  }

}
