import { Routes } from '@angular/router';
import { RegisterComponent } from './register/customer/register/register.component';
import { LoginComponent } from './login/login.component';
import { TwoFactorAuthComponent } from './login/two-factor-auth/two-factor-auth.component';
import { LoginWelcomeComponent } from './login/login-welcome/login-welcome.component'; 
import { Header1Component } from './register/homePage/header1/header1.component';
import { RegisterComponentOperator } from './register/homePage/operator/register/register.component';
import MainPageComponent from './payment/main-page/main-page.component';
import { RegisterComponentAdmin } from './register/homePage/admin/register/register.component';
import { ChangePasswordComponent } from './register/change-password/change-password.component';
import { PagoExitosoComponent } from './payment/pago-exitoso/pago-exitoso.component';
//import { PagoCanceladoComponent } from './payment/pago-cancelado/pago-cancelado.component';
import { AddProductComponent } from './operator/add-product/add-product.component';
import { UpdateProductComponent } from './operator/update-product/update-product.component';
//import { TablaComponent } from './operator/tabla/tabla.component';


import { PoliticasPrivacidadComponent } from './shared/ui/footer/politicas-privacidad/politicas-privacidad.component';
import { TerminosCondicionesComponent } from './shared/ui/footer/terminos-condiciones/terminos-condiciones.component';
import { TableProductsComponent } from './operator/table-products/table-products.component';
import { NewPassComponent } from './login/new-pass/new-pass.component';
import { roleGuard } from './shared/guards/role.guard';
export const routes: Routes = [
    {
      path: '',
      loadChildren: () => import('./client/client.routes')
    },
    { path: 'register-customer', component: RegisterComponent},
    { path: 'register-operator', component: RegisterComponentOperator},
    { path: 'register-admin', component: RegisterComponentAdmin},
    { path: 'admin', component: Header1Component, canActivate: [roleGuard], data: { expectedRoles: ['administrador', 'operador'] }},
    { path: 'reset-password', component: ChangePasswordComponent},
    { path: 'payment-process', component: MainPageComponent},
    { path: 'login', component: LoginComponent },            // Ruta para el login
    { path: 'twofactor', component: TwoFactorAuthComponent },// Ruta para twofactor
    { path: 'login-welcome', component: LoginWelcomeComponent }, // Ruta de bienvenida después del login
    {path: 'operator/add-product', component: AddProductComponent, canActivate: [roleGuard], data: { expectedRoles: ['operador', 'administrador'] }},
    {path: 'payment-success', component: PagoExitosoComponent}, // Ruta para el pago exitoso
    {path: 'politicas-privacidad', component: PoliticasPrivacidadComponent},
    {path: 'terminos-condiciones', component: TerminosCondicionesComponent},
    //{path: 'payment-cancel', component: PagoCanceladoComponent}, // Ruta para el pago cancelado
    {path: 'operator/table-products', component: TableProductsComponent, canActivate: [roleGuard], data: { expectedRoles: ['operador', 'administrador'] }},
    {path: 'new-pass', component: NewPassComponent},
    {path: 'operator/update-product', component: UpdateProductComponent, canActivate: [roleGuard], data: { expectedRoles: ['operador', 'administrador'] }},
    {
      path: '**',
      redirectTo: '',
    },
];
