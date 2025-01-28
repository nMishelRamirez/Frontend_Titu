import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../notificationService/notification.service';  // Asegúrate de importar el servicio

@Component({
  selector: 'app-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  message: string = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.message$.subscribe((message: string) => {
      this.message = message;
      setTimeout(() => {
        this.message = '';  // Limpiar el mensaje después de 5 segundos
      }, 5000);
    });
  }
}
