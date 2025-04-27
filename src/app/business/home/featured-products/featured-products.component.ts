import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
@Component({
  standalone: true,
  selector: 'app-featured-products',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent implements OnInit{

  constructor(private productsService: ProductsService) { }

  featuredProducts: any[] = [];
  
  ngOnInit() {
    this.productsService.getRecommendedProducts().subscribe((data: any) => {
      console.log('Productos recibidos:', data);
      this.featuredProducts = data.slice(0, 5);
    });


  }
}
