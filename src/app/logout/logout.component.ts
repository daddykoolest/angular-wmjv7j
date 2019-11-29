import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: [ '../navigation/navigation.component.css' , './logout.component.css']
})

export class LogoutComponent implements OnInit {

  constructor(
    private router: Router, private userService: UserService ) { }

  ngOnInit() {
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('commandChosen');
    localStorage.removeItem('currentStep');
    localStorage.removeItem('minionChosen');
    localStorage.removeItem('parameters');
    localStorage.removeItem('commandStarted');
    if (this.router.url === '/') {
        this.router.navigate(['login']);
    } else {
        this.router.navigate(['']);
    }
    this.userService.logout();
 }

}
