import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth.service';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Accede a los roles esperados desde los datos de la ruta
  const expectedRoles: string[] = route.data['expectedRoles'] || [];

  if (!expectedRoles.length) {
    console.error('No se encontraron roles esperados en la configuración de la ruta.');
    return false;
  }

  return authService.getAccessToken().pipe(
    map(user => {
      if (!user || !expectedRoles.includes(user.role)) {
        // Redirige si el usuario no tiene el rol esperado
        router.navigate(['/unauthorized']);
        return false;
      }
      return true; // Permite la navegación si el rol coincide
    })
  );
};
