import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getProductImage } from '../../utils/images';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(private router: Router) {}

  ngOnChanges() {}

  ngOnInit() {}

  showDetails() {
    this.router.navigate(['/product', this.product.id], {});
  }

  getProductImage(category: string): string {
    return getProductImage(category);
  }
}
