import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../constants/globals';
import { getHeaders } from '../../shared/utils/requests';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}

  private ADMIN_URL = `${Globals.API_URL}/log`;

  getOverview() {
    return this.httpClient.get(`${this.ADMIN_URL}/overview`, {
      headers: getHeaders(),
    });
  }

  addStock(product_id: string, quantity: number): any {
    return this.httpClient.put(
      `${Globals.API_URL}/locations/stock/update`,
      { product_id, quantity },
      {
        headers: getHeaders(),
      }
    );
  }
}
