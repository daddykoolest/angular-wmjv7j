import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isAuthenticated(): boolean {
    const rawToken = localStorage.getItem('token');
    if (rawToken == null) {
      return false;
    }

    const isExpired = new JwtHelperService().isTokenExpired(rawToken);
    if (isExpired) {
      return false;
    }

    return true;
  }
}
