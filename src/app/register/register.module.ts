import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../register/shared/validation.service';
import {RegisterSuccessComponent} from '../register/customer/register-success/register-success.component';
import { Header1Component } from './homePage/header1/header1.component';
import { CaptchaModalComponent } from '../register/customer/captcha-modal/captcha-modal.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, // Necesario para usar directivas como ngIf, ngFor
    FormsModule, // Si usas ngModel o formularios template-driven
    ReactiveFormsModule,
    ReactiveFormsModule,
    RegisterSuccessComponent,
    Header1Component,
  ],
  exports: [ RegisterSuccessComponent, Header1Component],
})

export class RegisterModule { }
