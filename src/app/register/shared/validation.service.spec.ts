import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  // Validar email
  validateEmail(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !regex.test(control.value)) {
      return { emailInvalid: true };
    }
    return null;
  }

  // Validar teléfono
  validatePhone(control: AbstractControl): ValidationErrors | null {
    const regex = /^09\d{8}$/;
    if (control.value && !regex.test(control.value)) {
      return { phoneInvalid: true };
    }
    return null;
  }

  // Validar contraseña
  validatePassword(control: AbstractControl): ValidationErrors | null {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (control.value && !regex.test(control.value)) {
      return { passwordInvalid: true };
    }
    return null;
  }
}

