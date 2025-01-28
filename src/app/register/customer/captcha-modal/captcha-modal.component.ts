import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterSuccessComponent } from '../register-success/register-success.component';

@Component({
  selector: 'app-captcha-modal',
  imports: [CommonModule],
  templateUrl: './captcha-modal.component.html',
  styleUrls: ['./captcha-modal.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CaptchaModalComponent {

  siteKey = '40949738-7d76-4b0a-8578-cce22a843154';  // Tu clave de sitio de hCaptcha
  captchaVerified = false; // Estado para verificar si el CAPTCHA fue exitoso
  captchaFailed = true; // Estado si la verificación falló
  showModalSecurity = true; // Controlar la visibilidad del modal del CAPTCHA

  testToken: string = ''; // Aquí se almacenará el token del captcha
  
  @Output() closeModal = new EventEmitter<boolean>(); // Emitir evento para cerrar el modal
  @Output() captchaVerifiedEvent = new EventEmitter<string>();  // Evento para informar si el CAPTCHA fue verificado
  @Output() captchaFailedEvent = new EventEmitter<void>();  // En caso de que falle

  constructor() {}

  onCaptchaVerified(event: any): void {
    // Aquí asumimos que el token está en el campo 'h-captcha-response' o el que esté usando hCaptcha
    const token = (document.querySelector('[name="h-captcha-response"]') as HTMLInputElement).value;
    console.log("Token recibido en el componente principal: ", token);

    if (token) {
      this.captchaVerified = true;
      this.captchaFailed = false;
      this.captchaVerifiedEvent.emit(token); // Emitir el token como string
      console.log('Captcha emitido:', this.captchaVerified);
      this.closeModal.emit(true); 
      this.closeCaptchaModal(); // Cerrar el modal
    } else {
      this.captchaVerified = false;
      this.captchaFailed = true;
      this.captchaFailedEvent.emit(); // Emitir evento de fallo
      console.log('Captcha fallido');
    }
  }

  // Función para manejar errores
  onCaptchaError(event: any) {
    console.log('Error en el CAPTCHA:', event);
    this.captchaVerified = false;
    this.captchaFailed = true;
  }

  // Cerrar el modal del CAPTCHA
  closeCaptchaModal() {
    this.showModalSecurity = false;
  }

  // Detecta clics fuera del contenido del modal y lo cierra
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const modalContent = document.querySelector('.modal-content'); // Selecciona el contenedor del contenido del modal
    const modalOverlay = document.querySelector('.modal-overlay'); // Selecciona el contenedor del modal general

    // Verifica si el clic fue fuera del contenedor modal
    if (modalOverlay && !modalOverlay.contains(event.target as Node)) {
      this.close(); // Cierra el modal si el clic está fuera
    }
  }

  /**
 * Método para cerrar el modal si el CAPTCHA ha sido completado.
 */
  close(): void {
    if (!this.captchaVerified) {
      alert('Debe completar el CAPTCHA primero');
      // Mantiene el modal abierto si no ha completado el CAPTCHA
      this.showModalSecurity = true;
    } else {
      // Si el CAPTCHA está completado, cierra el modal
      this.closeCaptchaModal();
    }
  }
  
}
