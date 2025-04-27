import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../constants/globals';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private htttpClient: HttpClient) {}

  ORDERS_URL = `${Globals.API_URL}/orders`;

  getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    };
  }
  createPaymentIntent(shipping_method_id: string): any {
    const headers = this.getHeaders();
    return this.htttpClient.post(
      `${this.ORDERS_URL}/payment`,
      { shipping_method_id },
      { headers }
    )
  }

  getOrders(): any {
    const headers = this.getHeaders();
    return this.htttpClient.get(`${this.ORDERS_URL}`, { headers });
  }
}
