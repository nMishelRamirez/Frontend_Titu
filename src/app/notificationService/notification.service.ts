import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Creamos un objeto subject para manejar los mensajes
  private messageSubject = new Subject<string>();
  message$ = this.messageSubject.asObservable();

  // Método para mostrar un mensaje
  showMessage(message: string): void {
    this.messageSubject.next(message);
  }

  // Método para ocultar el mensaje
  clearMessage(): void {
    this.messageSubject.next('');
  }
}
