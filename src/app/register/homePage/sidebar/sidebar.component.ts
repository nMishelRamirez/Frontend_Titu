import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from "../../customer/register/register.component";


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule, RegisterComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  // Variables para controlar la visibilidad de los modales
  isModalCustomerOpen: boolean = false;
  isModalSesionOpen: boolean = false;

  // Funciones para abrir los modales
  openModalCustomer() {
    this.isModalCustomerOpen = true;
    document.body.classList.add('modal-open');  // Añadir la clase modal-open al body
  }

  isModalSessionOpen() {
    this.isModalSesionOpen = true;
    
  }

  // Funciones para cerrar los modales
  closeModalCustomer() {
    this.isModalCustomerOpen = false;
    document.body.classList.remove('modal-open');  // Quitar la clase modal-open del body
  }

  closeModalSesion() {
    this.isModalSesionOpen = false;
  }
}
