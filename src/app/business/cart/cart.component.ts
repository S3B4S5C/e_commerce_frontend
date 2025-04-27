import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductsService } from '../../core/services/products.service';
import { getProductImage } from '../../shared/utils/images';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export default class CartComponent {
  constructor(
    private cartService: CartService,
    private productService: ProductsService
  ) {}
  products: any[] = [];
  recomendedProducts: any[] = [];
  ngOnInit(): void {
    this.loadMockData();
  }

  getPhoto(product: any): string {
    return getProductImage(product.category);
  }
  
  increaseQuantity(product: any): void {
    // En una aplicación real, llamarías a tu servicio para actualizar la cantidad
    // this.cartService.updateQuantity(product.id, product.quantity + 1).subscribe();

    // Para fines de demostración, solo actualizamos los datos locales
    if (product.quantity < product.total_stock) {
      product.quantity += 1;
    }
  }

  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      // En una aplicación real, llamarías a tu servicio para actualizar la cantidad
      // this.cartService.updateQuantity(product.id, product.quantity - 1).subscribe();

      // Para fines de demostración, solo actualizamos los datos locales
      product.quantity -= 1;
    }
  }

  removeItem(product: any): void {
    this.cartService
      .removeFromCart(product.id)
      .subscribe(() => {
        this.products = this.products.filter((p) => p.id !== product.id);
      });
  }

  calculateSubtotal(): number {
    return this.products.reduce((total, product) => {
      return total + parseFloat(product.price) * product.quantity;
    }, 0);
  }

  calculateTaxes(): number {
    // Asumiendo que el impuesto es del 10% del subtotal
    return this.calculateSubtotal() * 0.1;
  }

  calculateTotal(): number {
    if (!this.products) return 0;
    return parseFloat(
      (this.calculateSubtotal() + this.calculateTaxes()).toFixed(2)
    );
  }

  calculateProductTotal(product: any): number {
    return parseFloat((product.quantity * product.price).toFixed(2));
  }

  loadMockData(): void {
    // This would be replaced with actual API call
    this.cartService.getCart().subscribe((data: any) => {
      this.products = data.products;
      this.productService
        .getRecommendedCartProducts(this.products[0].id)
        .subscribe((response: any) => {
          this.recomendedProducts = response.recommended_products.slice(0, 5);
          console.log('Recommended products:', response);
        });
    });
  }
}
