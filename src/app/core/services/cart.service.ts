import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from '../constants/globals';
import { Observable } from 'rxjs';
import { getHeaders } from '../../shared/utils/requests';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) {}

  CART_URL = `${Globals.API_URL}/cart`;


  addToCart(product_id: string, quantity_product: number): Observable<Object> {
    const body = {
      product_id,
      quantity_product,
    };

    const headers = getHeaders();
    return this.httpClient.post(`${this.CART_URL}/addproduct`, body, {
      headers,
    });
  }

  getCart(): Observable<Object> {
    const headers = getHeaders();
    return this.httpClient.get(`${this.CART_URL}/view`, {
      headers,
    });
  }

  removeFromCart(product_id: string): Observable<Object> {
    const headers = getHeaders();
    return this.httpClient.delete(`${this.CART_URL}/removeproduct`, {
      body: { product_id },
      headers,
    });
  }

  
}
