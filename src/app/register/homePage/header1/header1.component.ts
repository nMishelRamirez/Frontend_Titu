import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterFormComponentOperator } from "../../homePage/operator/register-form/register-form.component";
import { RegisterComponentOperator } from "../../homePage/operator/register/register.component";
import { RegisterComponentAdmin } from "../admin/register/register.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RegisterComponent } from "../../customer/register/register.component";


@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RegisterComponentOperator, RegisterComponentAdmin, SidebarComponent],
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css'
})
export class Header1Component {
  isModalOperatorOpen: boolean = false;  // Controlamos si el modal está abierto o cerrado
  isModalAdminOpen: boolean = false;  // Controlamos si el modal está abierto o cerrado
  isModalCustomerOpen: boolean = false;  // Controlamos si el modal está abierto o cerrado
  

  openModalOperator() {
    this.isModalOperatorOpen = true;  // Abrimos el modal
  }

  closeModalOperator() {
    this.isModalOperatorOpen = false;  // Cerramos el modal
  }

  openModalAdmin() {
    this.isModalAdminOpen = true;  // Abrimos el modal
  }

  closeModalAdmin() {
    this.isModalAdminOpen = false;  // Cerramos el modal
  }

  openModalCustomer() {
    this.isModalCustomerOpen = true;  // Abrimos el modal
  }

  closeModalCustomer() {
    this.isModalCustomerOpen = false;  // Cerramos el modal
  }


  togglePasswordVisibility(inputName: string) {
    const input = document.getElementById(inputName) as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
