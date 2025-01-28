//api para aplicaciones que utilizan stanadalone
//enciende angular
import { bootstrapApplication } from '@angular/platform-browser';
//configuracion globales
//le dice a angular como operar
import { appConfig } from './app/app.config';
//componente raiz de la aplicacion, su selector app-root va en el html
//es lo que angular debe contruir en la pantalla
import { AppComponent } from './app/app.component';

// Import the HCaptcha library
import '@hcaptcha/vanilla-hcaptcha'; 

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
