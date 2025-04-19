import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../constants/globals';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private PRODUCTS_URL = `${Globals.API_URL}/products/randomproducts`;
  private CATEGORIES_URL = `${Globals.API_URL}/products/categories`;

  constructor(private httpClient: HttpClient) {}

  getProducts(): any {
    return this.httpClient.get(this.PRODUCTS_URL);
  }

  getCategories(): any {
    return this.httpClient.get(this.CATEGORIES_URL);
  }
}
