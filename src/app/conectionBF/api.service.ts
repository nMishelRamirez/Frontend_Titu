import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private clientApiUrl = `${environment.API_URL}/clients/register`;
  private operatorApiUrl = `${environment.API_URL}/operators/register`;
  private adminApiUrl = `${environment.API_URL}/admins/register`;
  private productsEndpoint = `${environment.API_URL}/catalog/products`;
  private baseUrl = environment.ROOT_URL;
  private paypalApiUrl = `${environment.API_URL}/payments/create-payment`;
  //private changePasswordApiUrl = `${environment.ROOT_URL}/operator/set-password`;
  //private changePasswordApiUrl2 = `${environment.API_URL}/admins/request-password-change`;
  //private changePasswordApiUrl3 = `${environment.API_URL}/admins/set-password`;

  constructor(private http: HttpClient) {}

  // Método para registrar un cliente
  registerClient(clientData: any): Observable<any> {
    return this.http.post(this.clientApiUrl, clientData);
  }

  // Método para registrar un operador
  registerOperator(operatorData: any): Observable<any> {
    return this.http.post(this.operatorApiUrl, operatorData);
  }

  // Método para registrar un administrador
  registerAdmin(adminData: any): Observable<any> {
    return this.http.post(this.adminApiUrl, adminData);
  }
   // Método para obtener categorías
   getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/catalog/categories`);
  }

  // Método para agregar un producto
  addProduct(productData: FormData): Observable<any> {
    return this.http.post(this.productsEndpoint, productData); 
  }

  // Método para eliminar un producto
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.productsEndpoint}/${productId}`);
  }

  // Método para solicitar el cambio de contraseña
  requestPasswordChange(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/operators/request-password-change`, { email });
  }

  requestPasswordChangeClient(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/clients/request-password-change`, { email });
  }

  // Método para cambiar la contraseña
  getchangePasswordOperator(token: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/api/operators/set-password/${token}`);
  }

  getchangePasswordOperatorS(token: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/api/operators/request-password-change`);
  }

  // Método para cambiar la contraseña
  getchangePasswordAdmin(token: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/api/admins/set-password/${token}`);
  }

  // Método para cambiar la contraseña
  getchangePasswordClient(token: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/api/clients/set-password/${token}`);
  }


  registerPayment(paymentData: any): Observable<any> {
    return this.http.post(this.paypalApiUrl, paymentData);
  }

  // Método para obtener los productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/catalog/inventory/table`); 
  }

  // Método para obtener el id de los productos
  getIdByNameCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/catalog/inventory/getId`); 
  }

  updateProduct(productId: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/catalog/products/${productId}`, productData);
  }
  
  

  
}
