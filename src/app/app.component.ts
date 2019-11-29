import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService, private titleService: Title, private router: Router) {
    if (titleService !== null) {
      titleService.setTitle('Estate Manager for Covetrus');
    }
   }

   isNavigablePage() {
    return !this.router.url.includes('login') && !this.router.url.includes('unauthorized') && !this.router.url.includes('password');
  }

}
