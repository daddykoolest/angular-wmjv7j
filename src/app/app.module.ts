import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, MDBBootstrapModule.forRoot() ],
  declarations: [ AppComponent, HelloComponent, NavigationComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
