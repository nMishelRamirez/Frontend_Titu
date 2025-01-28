import { Component } from '@angular/core';
import { ApiService } from '../../conectionBF/api.service'; // Cambia esto si tu servicio tiene otro nombre
import { NotificationService } from '../../notificationService/notification.service'; // Cambia esto si tienes un servicio para notificaciones
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-new-pass',
  imports: [ CommonModule, FormsModule],
  templateUrl: './new-pass.component.html',
  styleUrl: './new-pass.component.css'
})
export class NewPassComponent {

  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private apiService: ApiService,  // Servicio que se encargará de hacer la solicitud al backend
    private notificationService: NotificationService  // Servicio para manejar notificaciones o alertas
  ) {}

  showInfoMessage(): void {
    this.notificationService.showMessage('¡Cambio de contraseña exitoso!');
  }

  // Método para mostrar un mensaje de error
  showErrorMessage(): void {
    this.notificationService.showMessage('¡Hubo un error al procesar tu solicitud!');
  }
  
  onSubmit(): void {
    if (!this.email) {
      this.errorMessage = 'Por favor ingresa tu correo electrónico.';
      return;
    }

    // Llamar al servicio que interactúa con el backend
    this.apiService.requestPasswordChangeClient(this.email).subscribe(
      (response) => {
        // Si el correo se envía con éxito
        this.successMessage = 'Te hemos enviado un correo con un enlace para restablecer tu contraseña.';
        this.notificationService.showMessage(this.successMessage);
      },
      (error) => {
        // Si ocurre un error (por ejemplo, el correo no está registrado)
        this.errorMessage = 'No pudimos encontrar una cuenta con ese correo electrónico.';
        this.notificationService.showMessage(this.errorMessage);
      }
    )}
}
