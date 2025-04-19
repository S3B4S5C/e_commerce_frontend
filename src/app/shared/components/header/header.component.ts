import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor (private productsService:ProductsService, private router: Router){}
  categoryProducts: any[] = [];

  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  onOptionClick(option: string) {
    console.log('Seleccionaste:', option);
    this.isOpen = false; // Cierra el menú al seleccionar
  }

  ngOnInit(){
    this.productsService.getCategories().subscribe((data:any) => {
        console.log(data);
        this.categoryProducts = data.categories;
        console.log(this.categoryProducts);
    });
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
}
