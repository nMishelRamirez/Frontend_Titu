import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewItemsComponent } from "../review-items/review-items.component";
import { CartStateService } from '../../shared/data-access/cart-state.service';
import { ProductItemCart } from '../../shared/interfaces/product.interface';
import { ValidationService } from '../../register/shared/validation.service';
import { NotificationService } from '../../notificationService/notification.service';
import { generarFactura } from '../lib/pdf';
import { environment } from '../../../../src/environments/environment';
import { jsPDF } from 'jspdf';
import { AuthService } from '../../shared/data-access/auth.service';
import { NotificationComponent } from "../../notification/notification.component";
import * as L from 'leaflet';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, FormsModule, ReviewItemsComponent, NotificationComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: true,
})
export default class MainPageComponent {
  // Traer el servicio AuthService
  authService = inject(AuthService);
  idUsuario = '';
  nombreUsuario = '';
  telefonoUsuario = '';
  correoUsuario = '';

  // Mensajes para mostrar en el template
  infoMessage: string | null = null;
  errorMessage: string | null = null;
  
  isFormValid = false;  // Nueva propiedad para controlar la validez del formulario

  isMessageVisible = true; // Inicialmente el mensaje es visible


  form = {
    address: '',
    postalCode: '',
  };

  constructor(
    private validationService: ValidationService,
    private notificationService: NotificationService,
  ) { }

  amount: number = 1;
  state = inject(CartStateService).state;

  map!: L.Map;
  marker!: L.Marker;



  clearError(fieldName: string): void {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  showError(fieldName: string, message: string): void {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  validateAddress(): boolean {
    if (!this.form.address) {
      this.showError('address', 'La dirección es obligatoria.');
      return false;
    } else if (!this.validationService.validarDireccion(this.form.address)) {
      this.showError('address', 'La dirección debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
      this.isFormValid = false;  // El formulario no es válido
      return false;
    } else {
      this.clearError('address');
      this.isFormValid = this.validatePostalCode();  // Verificamos si el código postal también es válido
      return true;
    }
  }

  validatePostalCode(): boolean {
    if (!this.form.postalCode) {
      this.showError('postalCode', 'El código postal es obligatorio.');
      return false;
    } else if (!this.validationService.validarPostalCode(this.form.postalCode)) {
      this.showError('postalCode', 'El código postal debe tener exactamente 6 dígitos.');
      this.isFormValid = false;  // El formulario no es válido
      return false;
    } else {
      this.clearError('postalCode');
      this.isFormValid = true;  // El formulario es válido
      return true;
    }
  }

  ngOnInit() {
    // Aquí asignamos el valor total de la compra a amount al inicializar el componente
    this.amount = this.state.price();
    this.updateDateTime();

    this.authService.getAccessToken().subscribe((res) => {
      this.idUsuario = res?.id || '';
      console.log('ID de usuario:', this.idUsuario);
    });

    this.authService.getUserData().subscribe((res) => {
      //console.log('Datos del usuario:', res);
      this.nombreUsuario = res.fullName || '';
      this.telefonoUsuario = res.phoneNumber || '';
      this.correoUsuario = res.email || '';
    });

    setTimeout(() => {
      this.isMessageVisible = false;
    }, 10000); // 10000 milisegundos = 10 segundos
  

    this.initializeMap();
  }

  async createPayment() {
    // Primero, validamos la dirección
    if (!this.validateAddress() || !this.validatePostalCode()) {
      console.log('Dirección no válida.');
      return;
    }
    // Obtenemos el monto y lo redondeamos a 2 decimales
    const totalAmount = parseFloat(this.amount.toFixed(2));

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      alert('No tienes productos en tu carrito. Por favor, agrega algunos productos a tu carrito para poder realizar el pago.');
      return;
    }
    // **Validar stock antes de crear el pago**
    const cartItems = this.state.products(); // Obtenemos los productos del carrito
    for (const item of cartItems) {
      if (item.product.stock <= 0) {
        // Si algún producto tiene stock 0, mostramos un mensaje y bloqueamos el pago
        alert(`El producto ${item.product.name} está agotado. No puede realizarse el pago.`);
        return; // Detenemos el proceso
      } else if (item.quantity > item.product.stock) {
        // Si la cantidad es mayor que el stock, mostramos un mensaje y bloqueamos el pago
        alert(`El producto ${item.product.name} tiene solo ${item.product.stock} unidades disponibles. No puede realizarse el pago.`);
        return; // Detenemos el proceso
      }
    }

    try {
      const response = await fetch(`${environment.API_URL}/payments/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount }),
      });

      const data = await response.json();
      if (data.id) {
        // Redirigimos a PayPal con el token recibido
        const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
        window.location.href = approvalUrl; // Redirige a la ventana de PayPal
      } else {
        alert('Error al crear el pago: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al conectar con el servidor.');
    }
  }
  updateDateTime() {
    const datetimeElement = document.getElementById('datetime');
    const update = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      if (datetimeElement) {
        datetimeElement.textContent = `Fecha: ${formattedDate} Hora: ${formattedTime}`;
      }
    };
    update();
    setInterval(update, 1000);
  }

  initializeMap() {
  // Crear el mapa centrado en una ubicación predeterminada
  this.map = L.map('map').setView([0, -78.5], 13);

  // Agregar una capa base utilizando OpenStreetMap
  //L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(this.map);

  // Corregir problemas de tamaño del mapa (necesario si el mapa está oculto inicialmente)
  setTimeout(() => {
    this.map.invalidateSize();
  }, 0);

    // Evento para capturar clics en el mapa
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      this.updateMarker(lat, lng); // Actualizar el marcador en el mapa
      this.fetchAddressFromCoordinates(lat, lng); // Obtener la dirección
    });
  }

  updateMarker(lat: number, lng: number) {
    // Si ya existe un marcador, lo eliminamos
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Crear un nuevo marcador en la ubicación seleccionada
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }

  async fetchAddressFromCoordinates(lat: number, lng: number) {
    try {
      // Llamada a la API de OpenStreetMap para obtener la dirección
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || 'Dirección no encontrada';

      // Actualizar el campo de dirección con la dirección obtenida
      this.form.address = address;
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    }
  }


  onRemove(id: string) {
    this.state.remove(id);
  }

  onIncrease(product: ProductItemCart) {
    this.state.udpate({
      product: product.product,
      quantity: product.quantity + 1,
    });
  }

  onDecrease(product: ProductItemCart) {
    this.state.udpate({
      ...product,
      quantity: product.quantity - 1,
    });
  }


  get totalPrice(): number {
    return this.state.products().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  showInfoMessage(): void {
    this.notificationService.showMessage('Te sugerimos descargar el PDF para tener una copia de tu factura.');
  }

  // Método para mostrar un mensaje de error
  showErrorMessage(): void {
    this.notificationService.showMessage('¡Hubo un error al procesar tu solicitud!');
  }

  // Método para generar el PDF
  generarPDF() {

    // Validamos la dirección y el código postal antes de proceder
    const isAddressValid = this.validateAddress();
    const isPostalCodeValid = this.validatePostalCode();

    // Si alguno de los dos campos es inválido, mostramos el mensaje de error y detenemos la generación del PDF
    if (!isAddressValid || !isPostalCodeValid) {
      console.log('Dirección o código postal no válidos.');
      this.showErrorMessage();  // Llamamos al método para mostrar el mensaje de error
      return;  // Detenemos el proceso de generación del PDF
    }

    const productos = this.state.products().map((item: ProductItemCart) => ({
      descripcion: item.product.name,
      cantidad: item.quantity,
      precio: item.product.price
    }));

    const factura = {
      numero: 'F001',
      fecha: new Date().toLocaleDateString(),
      cliente: this.nombreUsuario, // Aquí deberías usar el nombre del cliente real si está disponible
      email: this.correoUsuario,
      telefono: this.telefonoUsuario,
      direccion: this.form.address,
      codigoPostal: this.form.postalCode,
      productos: productos
    };

    generarFactura(factura);  // Llamamos la función pasando los datos de la factura
  }


  /*submitForm(): void {
    this.clearError('address');
    // Validamos cada campo
    this.validateAddress();

    const errorMessages = document.querySelectorAll('.error-message[style="display: block;"]');
    const hasErrors = errorMessages.length > 0;

    if (hasErrors) {
      this.showErrorMessage();
      console.log('Formulario inválido.');
    } else {
      // Si no hay errores, procedemos a crear el pago
      this.createPayment();
    }
  }*/
}

