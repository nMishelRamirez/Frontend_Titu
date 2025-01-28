import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterSuccessComponent } from '../register-success/register-success.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    RegisterSuccessComponent,
  ],
  exports: [ReactiveFormsModule]
})

export class RegisterModule { }


