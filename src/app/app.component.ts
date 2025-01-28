//Component permite declara componentes y ViewChild permite acceder a componentes hijos 
import { Component , ViewChild} from '@angular/core';
//import { RouterOutlet } from '@angular/router';

import { RegisterComponent } from './register/customer/register/register.component';  // Importa el componente RegisterComponent aquí
import { RegisterModule } from "./register/customer/register/register.module";
import { Header1Component } from "./register/homePage/header1/header1.component";
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TablaComponent } from "./operator/tabla/tabla.component";
import { TableProductsComponent } from './operator/table-products/table-products.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
})

export class AppComponent {

  title = 'frontend';
  //configurado para interactura con un con un componente hijo Register
  @ViewChild('registerComponent') registerComponent: RegisterComponent | undefined;

  // Método para abrir el modal desde el componente principal
  openModal(): void {
    if (this.registerComponent) {
      this.registerComponent.openModal();  // Llamamos al método openModal del componente hijo
    }
  }

}