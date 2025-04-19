import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
@Component({
  standalone: true,
  selector: 'app-featured-products',
  imports: [CommonModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent implements OnInit{

  constructor(private productsService: ProductsService) { }

  featuredProducts: any[] = [];
  
  ngOnInit() {
    this.productsService.getRecommendedProducts().subscribe((data: any) => {
      this.featuredProducts = data.slice(0, 5);
    });
  }
}
