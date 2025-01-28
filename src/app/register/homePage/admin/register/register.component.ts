import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';  // Importamos los componentes necesarios
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ValidationService } from '../../../shared/validation.service';  // Importa la clase ValidationService aquí
import { RegisterFormComponentAdmin } from '../../admin/register-form/register-form.component'; // Importa el componente RegisterFormComponent aquí
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-register-admin',
  standalone: true,  // Asegúrate de que sea un componente independiente
  imports: [CommonModule, FormsModule, RegisterFormComponentAdmin],  // Importa CommonModule y FormsModule aqu
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class RegisterComponentAdmin {

  constructor(private validationService: ValidationService) {}

  validateInputs(): void {
    const email = 'test@example.com';
    const phone = '0912345678';
    const password = 'Password@123';

    if (this.validationService.validarEmail(email)) {
      console.log('Email válido');
    } else {
      console.log('Email no válido');
    }

    if (this.validationService.validarTelefono(phone)) {
      console.log('Teléfono válido');
    } else {
      console.log('Teléfono no válido');
    }

    if (this.validationService.validarContrasena(password)) {
      console.log('Contraseña válida');
    } else {
      console.log('Contraseña no válida');
    }
  }


  showSuccessMessage = false;  // Modal de éxito cerrado
  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };
  
  nameError = false;
  emailError = false;
  phoneError = false;
  passwordError = false;
  confirmPasswordError = false;

  @Input() isOpen: boolean = false;  // Recibimos el estado desde el padre
  @Output() close = new EventEmitter<boolean>();  // Emitimos el evento para cerrar el modal

  closeModal() {
    this.close.emit(false);  // Emitimos el evento para cerrar el modal
  }

  closeSuccessMessage() {
    this.showSuccessMessage = false;  // Cerrar el modal de éxito
  }

  togglePasswordVisibility(inputName: string) {
    const input = document.getElementById(inputName) as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  submitForm() {
    // Validar el formulario (simplificado)
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      if (!this.user.name) this.nameError = true;
      if (!this.user.email) this.emailError = true;
      if (!this.user.password) this.passwordError = true;
      if (!this.user.confirmPassword) this.confirmPasswordError = true;
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.confirmPasswordError = true;
      return;
    }

    // Si todo está bien, mostrar el mensaje de éxito
    this.showSuccessMessage = true;
    this.isOpen = false;  // Cerrar el modal
  }
}
