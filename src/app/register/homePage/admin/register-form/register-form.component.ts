import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../../shared/validation.service';
import { RegisterSuccessComponent } from '../../../customer/register-success/register-success.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { CaptchaModalComponent } from "../../../customer/captcha-modal/captcha-modal.component";
import { Router } from '@angular/router';
import { ApiService } from '../../../../conectionBF/api.service';
import { NotificationService } from '../../../../notificationService/notification.service';
import { NotificationComponent } from "../../../../notification/notification.component"; 

@Component({
  selector: 'app-register-form-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterSuccessComponent, NotificationComponent],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RegisterFormComponentAdmin {
  form = {
    name: '',
    email: '',
    phone: '',  
    address: '',
    password: '',
    confirmPassword: ''
  };

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  // Para manejar los modales\
  // Bandera para controlar si el modal debe ser visible o no
  showSuccessModal: boolean = false;


  // Resetear el formulario y ocultar modales
  resetFormAndCloseModals() {
    // Resetear el formulario
    this.form = {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: ''
    };
    this.showSuccessModal = false;  // Cerrar el modal de éxito
  }

  // Inyectamos el Router en el constructor
  constructor(
    private validationService: ValidationService,
    private router: Router, // Inyectamos el Router
    private apiService: ApiService,  // Inyectar ApiService
    private notificationService: NotificationService,
  ) {}

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

  validateName(): void {
    if (!this.form.name) {
      this.showError('name', 'El nombre es obligatorio.');
    } else if (!this.validationService.validarNombre(this.form.name)) {
      this.showError('name', 'El nombre solo puede contener letras.');
    } else {
      this.clearError('name');
    }
  }

  validateEmail(): void {
    if (!this.form.email) {
      this.showError('email', 'El correo electrónico es obligatorio.');
    } else if (!this.validationService.validarEmail(this.form.email)) {
      this.showError('email', 'Ingresa un correo electrónico válido.');
    } else {
      this.clearError('email');
    }
  }

  validatePhone(): void {
    if (!this.form.phone) {
      this.showError('phone', 'El número de teléfono es obligatorio.');
    } else if (this.form.phone && !this.validationService.validarTelefono(this.form.phone)) {
      this.showError('phone', 'El número de teléfono debe comenzar con 09 y tener 10 dígitos.');
    } else {
      this.clearError('phone');
    }
  }

  validateAddress(): void {
    if (!this.form.address) {
      this.showError('address', 'La dirección es obligatoria.');
    } else if (!this.validationService.validarDireccion(this.form.address)) {
      this.showError('address', 'La dirección debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
    } else {
      this.clearError('address');
    }
  }
  
  validatePassword(): void {
    if (!this.form.password) {
      this.showError('password', 'La contraseña es obligatoria.');
    } else if (!this.validationService.validarContrasena(this.form.password)) {
      this.showError('password', 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
    } else {
      this.clearError('password');
    }
  }

  togglePasswordVisibility(inputName: string): void {
    if (inputName === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (inputName === 'confirm-password') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  showInfoMessage(): void {
    this.notificationService.showMessage('Se le envio un correo electrónico para su cambio de contraseña.');
  }

  // Validación completa al enviar el formulario
  submitForm(): void {
    // Primero limpiamos los errores antes de validar
    this.clearError('name');
    this.clearError('email');
    this.clearError('phone');
    this.clearError('address');
    this.clearError('password');
    this.clearError('confirmPassword');
    
    // Validamos cada campo
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validateAddress();
    this.validatePassword();
  
    // Verificar si hay errores en el formulario
    const errorMessages = document.querySelectorAll('.error-message[style="display: block;"]');
    const hasErrors = document.querySelectorAll('.error-message[style="display: block;"]').length > 0;

    if (!hasErrors) {
      this.showInfoMessage();
      //this.showSuccessModal = true;  // Muestra el modal de éxito
    } else {
      console.log('Formulario inválido.');
    }
    
    if (errorMessages.length === 0) {
      // Transformar los datos al formato esperado por el backend
      const adminData = {
        fullName: this.form.name,
        email: this.form.email,
        phoneNumber: this.form.phone,
        homeAddress: this.form.address
      };
  
      // Llamar al backend para registrar al administrador
      // Aquí deberías usar tu servicio para enviar los datos
      this.apiService.registerAdmin(adminData).subscribe(
        (response) => {
          console.log('Administrador registrado exitosamente:', response);
          this.showSuccessModal = true;
          this.resetFormAndCloseModals();
        },
        (error) => {
          console.error('Error al registrar al administrador:', error);
          alert('Error al registrar al administrador. Inténtalo de nuevo más tarde.');
        }
      );
    } else {
      console.log('Formulario inválido. Por favor, corrige los errores.');
    }
  }
  

  closeModal(): void {
    this.showSuccessModal=false;
  }

}
