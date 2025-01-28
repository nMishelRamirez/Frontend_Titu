//configuracion inicial de la aplicacion
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding} from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Importar provideHttpClient
import { routes } from './app.routes';
import { SearchStateService } from './client/components/search/data-access/search-state.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    SearchStateService, // Proveer el servicio de busqueda a nivel global
  ],
};