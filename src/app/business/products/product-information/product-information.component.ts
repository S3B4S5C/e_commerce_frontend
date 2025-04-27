import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { getProductImage } from '../../../shared/utils/images';

@Component({
  standalone: true,
  selector: 'app-product-information',
  imports: [CommonModule],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.css',
})
export default class ProductInformationComponent {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const productId: string = this.route.snapshot.paramMap.get('id') as string;

    try {
      this.productsService.getProductById(productId).subscribe((data: any) => {
        this.product = data;
        this.product.photo = getProductImage(this.product.category);
      });
    }
    catch (error) {
    }
  }

  addToCart(productId: string, quantity: number) {
    if(!this.authService.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }
    this.cartService.addToCart(productId, 1).subscribe((response) => {
      console.log('Product added to cart:', response);
      this.router.navigate(['/cart']);
    });
    return
  }
}
