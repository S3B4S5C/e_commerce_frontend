import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor (private productsService:ProductsService, private router: Router){}
  categoryProducts: any[] = [];

  ngOnInit(){
    this.productsService.getCategories().subscribe((data:any) => {
        console.log(data);
        this.categoryProducts = data.categories;
        console.log(this.categoryProducts);
    });
  }
  filtrarPorCategoria(valor: string | null) {
    if (!valor) {

      this.router.navigate(['/products']);
      return;
    }
  
    this.router.navigate(['/products'], { queryParams: { category: valor } });
  }
}
