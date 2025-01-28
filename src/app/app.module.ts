import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component'; // Si no es standalone, debe declararse aquí
import { routes } from './app.routes';

// Importación de componentes standalone
import { RegisterComponent } from './register/customer/register/register.component';
import { RegisterFormComponent } from './register/customer/register-form/register-form.component';
import { RegisterComponentOperator } from './register/homePage/operator/register/register.component';
import { RegisterComponentAdmin } from './register/homePage/admin/register/register.component';
//import { CaptchaModalComponent} from './register/customer/captcha-modal/captcha-modal.component';
import { ChangePasswordComponent } from './register/change-password/change-password.component';
import { RegisterSuccessComponent } from './register/customer/register-success/register-success.component';
import { SidebarComponent } from './register/homePage/sidebar/sidebar.component';
// Importación de bibliotecas externas
import '@hcaptcha/vanilla-hcaptcha';
import { RegisterModule } from './register/register.module';

// Importa los módulos de Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { TablaComponent } from './operator/tabla/tabla.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CookieService} from 'ngx-cookie-service';
import { AgGridAngular } from 'ag-grid-angular';
@NgModule({
    declarations: [],  // Aquí va AppComponent y RegisterComponent
    imports: [
        BrowserModule,
        CommonModule, 
        FormsModule, 
        RegisterModule,
        RegisterComponentOperator,
        RegisterComponentAdmin,
        RegisterComponent,
        RegisterSuccessComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        AppComponent,
        RegisterFormComponent,
        //CaptchaModalComponent,
        ChangePasswordComponent,
        SidebarComponent,
        TablaComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        AgGridAngular
        
    ],  
    providers: [provideHttpClient(withInterceptorsFromDi()), CookieService],
    bootstrap: []
    
})
export class AppModule {}
