import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const jwtHelper = new JwtHelperService();
    const token = jwtHelper.decodeToken(localStorage.getItem('token'));

    if (!this.auth.isAuthenticated() && !this.router.url.startsWith('/reset')) {
      this.router.navigate(['login']);
      return false;
    }

    if (token.userRole > expectedRole) {
      this.router.navigate(['unauthorized']);
      return false;
    }

    return true;
  }


}
