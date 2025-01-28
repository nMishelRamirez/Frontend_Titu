import { Component, Input,EventEmitter,Output,SimpleChanges, ChangeDetectorRef  } from '@angular/core';

@Component({
  selector: 'app-login-welcome',
  imports: [],
  templateUrl: './login-welcome.component.html',
  styleUrl: './login-welcome.component.css',
  standalone: true,
})

export class LoginWelcomeComponent {
  @Input() userName: string = 'Usuario';
  @Input() role: string = ''; // Nuevo Input para recibir el rol
  @Output() close = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Cambios detectados en LoginWelcomeComponent:', changes);
    console.log('Nombre recibido:', this.userName);
    console.log('Rol recibido:', this.role);


    if (changes['role']) {
      this.cdr.detectChanges();
    }
  }
  

  closeModal(): void {
    this.close.emit();  // Emitir evento para cerrar el modal
  }
  
  getWelcomeMessage(): string {
    console.log('Tipo de rol:', typeof this.role); // Agrega esta línea para ver qué tipo de valor se pasa.
    switch (this.role) {
      case 'cliente':
        return `¡Bienvenida/o, ${this.userName}!`;
      case 'operador':
        return '¡Bienvenido/a, Operador!';
      case 'administrador':
        return '¡Bienvenido/a, Administrador!';
      default:
        return '¡Bienvenido/a!';
    }
  }

}