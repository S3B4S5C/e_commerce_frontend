import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGGIN_URL = "http://127.0.0.1:8000/users/login";
  private REGISTER_URL = "http://127.0.0.1:8000/users/signup";
  private tokenKey = 'authToken';
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.httpClient.post(this.LOGGIN_URL, { email, password }).pipe(
      tap((response: any) => {
        const token = response.access;
        console.log(token);
        if (token) {
          this.loggedIn.next(true);
          this.setToken(token);
          this.router.navigate(['/']);
        }
      })
    );
  }

  register(email: string, password: string, name: string, cellphone: string, birth_date: string, gender: string) {
    return this.httpClient.post(this.REGISTER_URL, { email, password, name, cellphone, birth_date, gender }).pipe(
      tap((response: any) => {
        const token = response.access;
        console.log(token);
        if (token) {
          this.setToken(token);
          this.router.navigate(['/']);
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    if (!this.getToken()) {
      return false;
    }
    const token = this.getToken() as string;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(payload.exp * 1000);

    const isExpired = expirationDate < new Date();
    this.loggedIn.next(!isExpired);
    return !isExpired;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
