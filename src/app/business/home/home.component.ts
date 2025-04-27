import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CategoriesPreviewComponent } from './categories-preview/categories-preview.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  imports: [CategoriesPreviewComponent, FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.scrollTo({ top: 110, behavior: 'smooth' });
      }, 100);
    }
  }

  mainButtonHandler(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const target = Math.max(maxScroll - 50, 0); // Por ejemplo, 400px antes del fondo
        window.scrollTo({ top: target, behavior: 'smooth' });
      }, 0);
    }
  }
  
}
