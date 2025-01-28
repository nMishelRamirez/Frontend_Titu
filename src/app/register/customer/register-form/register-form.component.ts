import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../shared/validation.service';
import { RegisterSuccessComponent } from '../register-success/register-success.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CaptchaModalComponent } from "../captcha-modal/captcha-modal.component";
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../conectionBF/api.service'; // Importamos el servicio para registrar clientes
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterSuccessComponent, CaptchaModalComponent, RouterModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterFormComponent {
  form = {
    name: '',
    email: '',
    phone: '', // Campo opcional
    password: '',
    confirmPassword: '',
  };

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  // Para manejar los modales
  @Output() captchaVerifiedEvent = new EventEmitter<string>(); // Emitimos el token como string

  showModalSecurity: boolean = false;  // Para controlar la visibilidad del modal del CAPTCHA
  showRegisterSuccessModal: boolean = false;  // Para controlar la visibilidad del modal de éxito
  captchaToken: string | null = null;


  // Bandera para controlar si el modal debe ser visible o no
  showSuccessModal: boolean = false;

  backendError: string | null = null; 

  // Resetear el formulario y ocultar modales
  resetFormAndCloseModals() {
    // Resetear el formulario
    this.form = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
    this.showRegisterSuccessModal = false;  // Cerrar el modal de éxito
    this.showModalSecurity = false;         // Cerrar el modal del CAPTCHA
  }

  // Inyectamos el Router en el constructor
  constructor(
    private validationService: ValidationService,
    private apiService: ApiService // Inyectamos el servicio
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

  validatePassword(): void {
    if (!this.form.password) {
      this.showError('password', 'La contraseña es obligatoria.');
    } else if (!this.validationService.validarContrasena(this.form.password)) {
      this.showError(
        'password',
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.'
      );
    } else {
      this.clearError('password');
    }
  }

  validateConfirmPassword(): void {
    if (!this.form.confirmPassword) {
      this.showError('confirmPassword', 'La confirmación de contraseña es obligatoria.');
    } else if (this.form.password !== this.form.confirmPassword) {
      this.showError('confirmPassword', 'Las contraseñas no coinciden.');
    } else {
      this.clearError('confirmPassword');
    }
  }

  togglePasswordVisibility(inputName: string): void {
    if (inputName === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (inputName === 'confirm-password') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // Validación completa al enviar el formulario
  submitForm(): void {
    this.clearError('name');
    this.clearError('email');
    this.clearError('phone');
    this.clearError('password');
    this.clearError('confirmPassword');
  
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validatePassword();
    this.validateConfirmPassword();
  
    const hasErrors = document.querySelectorAll('.error-message[style="display: block;"]').length > 0;
  
    if (!hasErrors) {
      this.showModalSecurity = true;
    } else {
      console.log('Formulario inválido.');
    }
  }

  // Método para manejar la verificación del CAPTCHA
  onCaptchaVerified(token: string): void {
    this.captchaVerifiedEvent.emit(token);

    if (token) {
      this.captchaToken = token;  // Guardamos el token del CAPTCHA
      console.log('Token guardado:', token);
      this.showModalSecurity = false;  // Cierra el modal del CAPTCHA
  
      // Realizamos el registro del cliente
      this.registerClient(); // Aquí llamamos al método para registrar el cliente

    } else {
      alert('Debe completar el CAPTCHA correctamente');
    }
  }

  // Método para registrar al cliente (después de la verificación del CAPTCHA)
  registerClient(): void {
    
    const clientData = {
      fullName: this.form.name,
      email: this.form.email,
      phoneNumber: this.form.phone || null,
      password: this.form.password,
      captchaToken: this.captchaToken,  // El token del CAPTCHA
    };
  
    if (this.captchaToken!= null) {
      this.apiService.registerClient(clientData).subscribe({
        next: (response) => {
          console.log('Cliente registrado con éxito:', response);
          this.showSuccessModal = true;  // Muestra el modal de éxito
          this.resetFormAndCloseModals();
        },
        error: (error) => {
          console.error('Error al registrar cliente:', error);
          this.backendError = error?.error?.message || 'Ocurrió un error al registrar el cliente debido a datos duplicados. Por favor, intenta nuevamente más tarde.';
          alert(this.backendError);
        }
      });
    } else {
      console.error('El CAPTCHA no fue verificado o el token no es válido.');
      this.backendError = 'Por favor, completa el CAPTCHA correctamente.';
      alert(this.backendError);
    }
  }  
  

  closeSuccessModal() {
    // Llamar a la función que resetea el formulario y oculta el modal de éxito
    this.resetFormAndCloseModals();
  }
}

