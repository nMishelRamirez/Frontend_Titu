import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart-state.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { NgIf } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartState = inject(CartStateService).state;
  authService = inject(AuthService);
  cookieService = inject(CookieService);
  isLogged = false;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  userId = '';
  userEmail = '';
  userRole = '';

  searchForm = new FormGroup({
    searchText: new FormControl(''),
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuth().subscribe((value) => {
      this.isLogged = value;

      if (this.isLogged) {
        this.authService.getAccessToken().subscribe((res) => {
          this.userId = res?.id || '';
          this.userEmail = res?.email || '';
          this.userRole = res?.role || '';
        })
      }
    })
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onSearch() {
    const searchText = this.searchForm.value.searchText;

    if (searchText) {
      // Navegar a la URL con el query string
      this.router.navigate(['/search'], { queryParams: { query: searchText.trim() } });
    }
  }

  logout() {
    this.cookieService.delete('access_token', '/');  // Elimina la cookie de todo el dominio

    // Redirige al usuario a la página de login o cualquier otra página
    this.router.navigate(['/']).then(() => {
      window.location.reload();  // Recarga la página completamente
    });
  }

  primerLetaMayus(value: string) {
    if (!value) return ''; // Si el valor es vacío, devuelve una cadena vacía
    return value.charAt(0).toUpperCase();
  }

}
