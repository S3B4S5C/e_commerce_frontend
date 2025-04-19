import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
@Component({
  selector: 'app-categories-preview',
  imports: [CommonModule],
  templateUrl: './categories-preview.component.html',
  styleUrl: './categories-preview.component.css'
})
export class CategoriesPreviewComponent {

  constructor(private productsService: ProductsService) { }

  categories: any[] = [];

  ngOnInit() {
    this.productsService.getCategories().subscribe((data: any) => {
      console.log(data);
      this.categories = data.categories.slice(0, 8); // Get the first 5 categories
      console.log('hola')
      console.log(this.categories);
    });
  }
}
