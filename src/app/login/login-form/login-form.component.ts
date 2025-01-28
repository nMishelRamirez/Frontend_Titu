import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para el backend
import { LoginWelcomeComponent } from '../login-welcome/login-welcome.component';
import { RegisterComponent } from '../../register/customer/register/register.component';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, RouterModule, LoginWelcomeComponent, RegisterComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
})
export class LoginFormComponent {
  router = inject(Router);

  //almacena datos y envia mensajes de exito o error en del formulario
  email: string = '';
  password: string = '';
  error: string | null = null; // Para manejar errores específicos
  loginMessage: string | null = null;
  loginSuccess: boolean = false;
  //para el mensaje de login exitoso
  userName: string = ''; // Asegúrate de que esta propiedad esté definida
  showWelcome: boolean = false;
  role: string = '';
  phoneNumber: string = ''; 

  // Variables para controlar la visibilidad de los modales
  isModalCustomerOpen: boolean = false;
  isModalSesionOpen: boolean = false;

  // Funciones para abrir los modales
  openModalCustomer() {
    this.isModalCustomerOpen = true;
    document.body.classList.add('modal-open');  // Añadir la clase modal-open al body
  }

  // Funciones para cerrar los modales
  closeModalCustomer() {
    this.isModalCustomerOpen = false;
    document.body.classList.remove('modal-open');  // Quitar la clase modal-open del body
  }

  //constructor para inyeccion de dependencias y hacer peticiones http
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {} // Inyección de HttpClient

  //metodo par alterna visibilidad de contrasenia
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
  //metodo principal
  onSubmit() {
    // Limpia mensajes previos
    this.error = null;
    this.loginMessage = null;

    // Validación básica verifica si los campos estan vacios
    if (!this.email || !this.password) {
      this.error = 'missing-fields';
      this.loginMessage = 'Por favor, llena todos los campos.';
      this.loginSuccess = false;
      return;
    }
    // Validación del formato del correo electrónico
    if (!this.validarEmail(this.email)) {
    this.error = 'invalid-email';
    this.loginMessage = 'El correo electrónico no tiene un formato válido.';
    this.loginSuccess = false;
    return;
    }
 // Lógica de autenticación, petición al backend
 this.http
 .post(`${environment.API_URL}/login`, {
   email: this.email,
   password: this.password,
 }, { withCredentials: true })
 .subscribe(
   (response: any) => {
     // Manejo de token recibido
     const token = response.token; // Asegúrate de que el backend envíe el token
     if (token) {
       //this.storeToken(token); // Almacena el token
       this.loginSuccess = true;
       this.userName = response.userName || '';
       this.role = response.role || ''; // Recibir el rol
       this.phoneNumber = response.phoneNumber || ''; // Recibir el número de teléfono
       this.email = response.email || ''; 
       this.showWelcome = true;

       this.router.navigate(['/']);
     } else {
       this.error = 'token-missing';
       this.loginMessage = 'Error: No se recibió un token del servidor.';
     }
   },
   (error) => {
     this.loginSuccess = false;
     this.handleError(error);
   }
 );
  }
  // Almacena el token en localStorage
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Recupera el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  
  private validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  private handleError(error: any) {
    // Manejo de errores según el backend
    switch (error.status) {
      case 404:
        this.error = 'no-registrado';
        this.loginMessage = 'El correo electrónico no está registrado.';
        break;
      case 401:
        this.error = 'password';
        this.loginMessage = 'Contraseña incorrecta. Inténtalo de nuevo.';
        break;
      case 423:
        this.error = 'bloqueada';
        this.loginMessage =
          'Tu cuenta está temporalmente bloqueada. Intenta más tarde o restablece tu contraseña.';
        break;
      case 424:
        this.error = 'desactivada';
        this.loginMessage =
          'Tu cuenta ha sido desactivada debido a inactividad. Contacta con soporte.';
        break;
      case 403:
        this.error = 'cuenta-inactiva';
        this.loginMessage =
          'Tu cuenta no ha sido verificada. Revisa tu correo electrónico.';
        break;
      default:
        this.loginMessage = 'Ocurrió un error inesperado. Por favor, intenta más tarde.';
    }
  }
  closeWelcome() {
    this.showWelcome = false;
  }
}
