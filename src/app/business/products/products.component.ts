import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export default class ProductsComponent {
  @Input() products: any[] = [];
  search: string | null = null;
  currentPage = 1;
  itemsPerPage = 12;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  get paginatedResults() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  get searchQuery() {
    return this.search ? this.search : '';
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.search = params['name'];

      if (this.search) {
        this.productsService.searchProducts(this.search).subscribe((data: any) => {
          this.products = data;
        });
      }
    });
  }
}
