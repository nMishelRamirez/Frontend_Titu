import { Component,OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../shared/validation.service';
import { NotificationService } from '../../notificationService/notification.service';
import { NotificationComponent } from "../../notification/notification.component";  // Asegúrate de importar el servicio
import { ApiService } from '../../conectionBF/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../shared/data-access/auth.service';
@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ChangePasswordComponent {

  authService = inject(AuthService);

  form = {
    password: '',
    confirmPassword: '',
  };

  token: string | null = null;
  role: string | null = null;
  client: string | null = null;
  apiUrl: string = '';
  errorMessage: string | null = null;

  idUsuario: string | null = null;
  email: string | null = null;  

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  // Inyectamos el Router en el constructor
  constructor(
    private validationService: ValidationService,
    private router: Router, // Inyectamos el Router
    private apiService: ApiService, // Inyectamos el servicio
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private http: HttpClient, // Inyectamos el servicio
  ) { }

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

  showInfoMessage(): void {
    this.notificationService.showMessage('¡Cambio de contraseña exitoso!');
  }

  // Método para mostrar un mensaje de error
  showErrorMessage(): void {
    this.notificationService.showMessage('¡Hubo un error al procesar tu solicitud!');
  }

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    /*this.authService.getAccessToken().subscribe((res) => {
      this.idUsuario = res?.id || '';
      this.email = res?.email || '';
      this.role = res?.role || '';
      console.log('ID de usuario:', this.idUsuario);
      console.log('Email:', this.email);    
      console.log('Role:', this.role);
    });*/

    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('Token:', this.token);
      this.role = params['role'];
      this.apiUrl = environment.API_URL;
      this.client = params['client'];
      console.log('Role:', this.role);

      if (!this.token) {
        this.errorMessage = 'Token no encontrado en la URL.';
        console.log('Token no encontrado en la URL.');
      } else if (!this.role || !['admin', 'operator', 'client'].includes(this.role)) {
        this.errorMessage = 'Tipo de usuario no especificado o inválido en la URL.';
        console.log('Tipo de usuario no especificado o inválido en la URL.');
      } else {
        // Construir la ruta API según el rol
        let basePath = '';
        if (this.role === 'admin') {
          basePath = `${environment.API_URL}/admins/set-password`;
        } else if (this.role === 'operator') {
          basePath = `${environment.API_URL}/operators/set-password`;
        } else if (this.role === 'client') {
          basePath =  `${environment.API_URL}/clients/set-password`;
        }

        // Si se pasa el parámetro client, lo agregamos a la URL
        if (this.client) {
          basePath += `/${this.client}`;
        }

        this.apiUrl = `${basePath}/${this.token}`;
      }
    });
  }

  submitForm(): void {
    this.clearError('password');
    this.clearError('confirmPassword');

    this.validatePassword();
    this.validateConfirmPassword();

    const hasErrors = document.querySelectorAll('.error-message[style="display: block;"]').length > 0;

    if (!hasErrors) {
      this.showInfoMessage();
    } else {
      this.showErrorMessage();
      console.log('Formulario inválido.');
    }

    /*if (this.form.password === this.form.confirmPassword && !hasErrors) {
      // Lógica para restablecer la contraseña
      console.log('Contraseña restablecida exitosamente');
    } else {
      console.error('Las contraseñas no coinciden');
    }*/
    
    // Realizar la solicitud POST
    this.http
      .post(this.apiUrl, { password: this.form.password })
      .pipe(
        catchError((error) => {
          this.errorMessage = error?.error?.message || 'Error al enviar la solicitud. Intenta de nuevo.';
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert('Contraseña configurada exitosamente.');
          this.router.navigate(['/login']);  // Redirigir al login u otra página según el flujo
        }
      });
  }

  

}


