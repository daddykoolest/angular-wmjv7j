import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, public userService: UserService) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated() && this.router.url !== '/login') {
      this.router.navigate(['login']);
      this.userService.logout();
      return false;
    }
    return true;
  }
}
