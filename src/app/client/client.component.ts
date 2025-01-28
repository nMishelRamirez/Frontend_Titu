import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../shared/ui/footer/footer.component';

@Component({
  selector: 'app-client',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

}
