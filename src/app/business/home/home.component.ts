import { Component } from '@angular/core';
import { CategoriesPreviewComponent } from './categories-preview/categories-preview.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  imports: [CategoriesPreviewComponent, FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {

}
