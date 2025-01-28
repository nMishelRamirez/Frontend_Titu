import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Importa el Router
import { CartStateService } from '../../shared/data-access/cart-state.service';
import { ProductItemCart } from '../../shared/interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../src/environments/environment';
import { NotificationService } from '../../notificationService/notification.service';

@Component({
  selector: 'app-pago-exitoso',
  imports: [CommonModule],
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.css']
})

export class PagoExitosoComponent implements OnInit {
  status: string = 'Procesando el pago...';
  details: string = 'Por favor, espere mientras confirmamos su transacción.';

  constructor(
    private route: ActivatedRoute,
    private cartStateService: CartStateService,
    private router: Router,  // Inyecta el Router para la redirección
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; // Obtener el "token" desde la URL
      console.log('Token recibido:', token);

      if (token) {
        // Llamar a la función para capturar el pago
        this.capturePayment(token);
      } else {
        this.status = 'Error: No se encontró el token del pago.';
        this.details = 'Por favor, intente nuevamente.';
      }
    });
  }

  async capturePayment(orderID: string): Promise<void> {
    try {
      const response = await fetch(`${environment.API_URL}/payments/capture-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }), // Enviar el orderID al backend
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      // Lógica para actualizar el estado del pago
      if (data.status === 'COMPLETED') {
        this.status = '¡Pago Completado!';
        this.details = `Su transacción se completó con éxito. \n`;

        // Ahora actualizamos el stock de los productos en la base de datos
        await this.updateStockAfterPurchase();

        // Limpiar el carrito después de la compra exitosa
        this.cartStateService.state().products = []; 
        console.log('Carrito limpiado después de la compra exitosa', this.cartStateService.state().products);

        // Vaciar el carrito
        this.clearCart();

        // Esperar 5 segundos antes de redirigir a la página principal
        setTimeout(() => {
          this.router.navigate(['/']);  // Redirige a la página principal

          // Después de 1 segundo de redirigir, recargar la página principal
          setTimeout(() => {
            window.location.reload();  // Recarga la página principal
          }, 0.001);  // 1 segundo de espera antes de recargar
        }, 5000);  // 5000 ms = 5 segundos de espera antes de redirigir

      } else {
        this.status = 'Pago no completado';
        this.details = `Estado del pago: ${data.status}`;
        this.goToHome();
      }
    } catch (error) {
      console.error('Error al capturar el pago:', error);
      this.status = 'Error en la transacción';
      this.details = 'No pudimos procesar su pago. Inténtelo nuevamente.';
      this.goToHome();
    }
  }

  // Función para actualizar el stock de los productos
  async updateStockAfterPurchase(): Promise<void> {
    try {
      // Obtener los productos del carrito desde el servicio CartStateService
      const cartItems = this.cartStateService.state().products;
      console.log('Productos del carrito:', cartItems); 
      const productData = cartItems.map((item: ProductItemCart) => ({
        productId: item.product._id,  // Asumimos que cada item tiene un ID del producto
        quantity: item.quantity
      }));

      // Enviar la solicitud para actualizar el stock
      const response = await fetch(`${environment.API_URL}/catalog/products/update-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: productData })
      });

      const data = await response.json();
      if (data.message === 'Stock actualizado correctamente') {
        console.log('Stock actualizado exitosamente');
        // Limpiar el carrito después de la compra exitosa
        this.cartStateService.state().products = [];
      } else {
        console.error('Error al actualizar el stock:', data);
      }
    } catch (error) {
      console.error('Error al intentar actualizar el stock:', error);
    }
  }

  // Función para vaciar el carrito
  clearCart(): void {
    this.cartStateService.state().products = [];  // Vaciar carrito
    // Eliminar prouductos guardados en el localStorage
    localStorage.removeItem('products');
    console.log('Productos guardados en el localStorage:', localStorage.getItem('products'));
    console.log('Carrito vaciado exitosamente');
    
  }

  // Función para volver al inicio
  goToHome(): void {
    this.router.navigate(['/']); // Redirige a la página de inicio
  }
  
}
