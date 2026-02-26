import { Injectable } from '@angular/core';
import { UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  saveAuthData(res: any): void {
    localStorage.setItem(this.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, res.refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
  }

  getAccessToken(): string | null { return localStorage.getItem(this.ACCESS_TOKEN); }
  getRefreshToken(): string | null { return localStorage.getItem(this.REFRESH_TOKEN); }
  
  getUser(): UserResponse | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  clear(): void { localStorage.clear(); }
}