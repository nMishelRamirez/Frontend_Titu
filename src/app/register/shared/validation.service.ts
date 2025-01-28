import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Función para validar el nombre
  validarNombre(nombre: string): boolean {
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(nombre);
  }
  
  // Validar correo electrónico
  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  // Validar número de teléfono
  validarTelefono(telefono: string): boolean {
    const regex = /^09\d{8}$/;
    return regex.test(telefono);
  }

  // Validar dirección
  validarDireccion(direccion: string): boolean {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s,.'-]+$/;
    return regex.test(direccion);
  }

  // Validar contraseña
  validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasena);
  }

  // Validar código postal Ecuador
  validarPostalCode(postalCode: string): boolean {
    const regex = /^[0-9]{6}$/;
    return regex.test(postalCode);
  }
}
