import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  isAuth(): Observable<boolean> {
    return this.http
    .get<{ valid: boolean }>(`${this.apiUrl}/auth/validate`, { withCredentials: true })
    .pipe(
      map(response => response.valid),
      catchError(() => of(false))
    );
  }

  getAccessToken(): Observable<{ id: string; email: string; role: string } | null> {
    return this.http
      .get<{ error: string | null; user: { id: string; email: string; role: string } | null }>(
        `${this.apiUrl}/auth/data`,
        { withCredentials: true }
      )
      .pipe(
        map(response => {
          if (response.error) {
            console.error(response.error);
            return null;
          }
          return response.user;
        }),
        catchError(error => {
          console.error('Error fetching access token.');
          return [null]; // Devuelve null en caso de error
        })
      );
  }

  

  // Método para obtener los detalles completos del usuario
  getUserData(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/auth/user/data`, { withCredentials: true })
      .pipe(
        map(response => {
          console.log('Response User Data:', response);
          return response;
        }),
        catchError(error => {
          console.error('Error fetching user data.');
          return [null]; // Devuelve null en caso de error
        })
      );
  }
}
