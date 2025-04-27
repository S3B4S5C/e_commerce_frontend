import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  headerOculto = false;
  lastScrollTop = 0;
  categoryProducts: any[] = [];
  isLoggedIn = false;
  isOpen = false;
  searchQuery: string = '';

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  onOptionClick(option: string) {
    console.log('Seleccionaste:', option);
    this.isOpen = false; // Cierra el menú al seleccionar
  }

  ngOnInit() {
    this.productsService.getCategories().subscribe((data: any) => {
      console.log(data);
      this.categoryProducts = data.categories;
      console.log(this.categoryProducts);
    });
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });

    this.authService.isLoggedIn();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onWindowScroll, true);
    }
  }

  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      this.headerOculto = true;
    } else {
      this.headerOculto = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  filtrarPorCategoria(valor: string | null) {
    console.log('Valor seleccionado:', valor);
    this.isOpen = false; // Cierra el menú al seleccionar
    if (!valor) {
      console.log('No se seleccionó ninguna categoría');
      this.router.navigate(['/products']);
      return;
    }

    this.router.navigate(['/products'], { queryParams: { category: valor } });
  }

  conditionalButton() {
    if (!this.isLoggedIn) {
      console.log('Logout button clicked');
      return this.router.navigate(['/login']);
    }
    console.log('Logout');
    return this.authService.logout();
  }

  onSearchChange() {}
  onSearch(): void {
    if (this.searchQuery) {
      this.router.navigate(['/products'], {
        queryParams: { name: this.searchQuery },
      });
    }
  }
}
