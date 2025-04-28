import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Globals } from '../constants/globals';
import { getHeaders } from '../../shared/utils/requests';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private ASSISTANT_URL = `${Globals.API_URL}/assistant`;

  constructor(private httpClient: HttpClient) { }

  voiceAssistant(data: any): any {
    return this.httpClient.post(`${this.ASSISTANT_URL}/voz/`, data, {
      headers: getHeaders(),
    });
  }
}
