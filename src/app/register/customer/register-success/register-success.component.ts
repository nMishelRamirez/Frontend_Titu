import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-success',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.css'
})

export class RegisterSuccessComponent {
  
  showModalSuccess: boolean = true;  // Mostrar el modal cuando se carga el componente

  constructor() {}

  closeModal() {
    this.showModalSuccess = false;  // Cerrar el modal
  }
}
