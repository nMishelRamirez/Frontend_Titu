import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { LoginFormComponent } from './login-form/login-form.component'; 
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  imports: [CommonModule, LoginFormComponent],  // Importa LoginFormComponent y RouterModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent {

  constructor(private router: Router) {}
  closeModal() {
   this.router.navigate(['/']);
  }
}

