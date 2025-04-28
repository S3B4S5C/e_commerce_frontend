import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../constants/globals';
import { getHeaders } from '../../shared/utils/requests';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private PRODUCTS_URL = `${Globals.API_URL}/products`;
  private CATEGORIES_URL = `${Globals.API_URL}/products/categories`;

  constructor(private httpClient: HttpClient) {}

  getProducts(): any {
    return this.httpClient.get(this.PRODUCTS_URL);
  }

  getCategories(): any {
    return this.httpClient.get(this.CATEGORIES_URL);
  }

  getRecommendedProducts(): any {
    return this.httpClient.get(`${this.PRODUCTS_URL}/recommended`);
  }

  searchProducts(query: string): any {
    return this.httpClient.get(`${this.PRODUCTS_URL}/searchProducts`, {
      params: { q: query },
    });
  }

  getProductById(id: string): any {
    return this.httpClient.get(`${this.PRODUCTS_URL}/getProduct/${id}`);
  }

  getRecommendedCartProducts(product_id: string): any {
    return this.httpClient.get(
      `${this.PRODUCTS_URL}/recommended_cart/${product_id}`,
      { headers: getHeaders() }
    );
  }


  // lo hice yo
  updateProduct(product: any): any {
    return this.httpClient.put(
      `${this.PRODUCTS_URL}/update/${product.id}`, 
      product,
      {
        headers: getHeaders(),
      }
    );
  }


  deleteProduct(productId: string): any {
    return this.httpClient.delete(`${this.PRODUCTS_URL}/delete/${productId}`, {
      headers: getHeaders(),
    });
  }
}
