import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  canShowNewUser = false;
  constructor() { }

  ngOnInit() {
  }

  showNewUser(): boolean{
    this.canShowNewUser = !this.canShowNewUser;
    return this.canShowNewUser;
  }

}
