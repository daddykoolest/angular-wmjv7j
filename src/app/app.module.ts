import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule, NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { CarouselComponent } from './carousel/carousel.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './logout/logout.component';
import { MinionsComponent } from './minions/minions.component';
import { CommandsComponent } from './commands/commands.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { ParametersComponent } from './parameters/parameters.component';
import { NewUserComponent } from './newuser/newuser.component';

import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { MinionDetailComponent } from './minion-detail/minion-detail.component';
import { CreateCommandComponent } from './create-command/create-command.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

import { CustomMinDirective } from './directives/minmax/min-value-validator.directive';
import { CustomMaxDirective } from './directives/minmax/max-value-validator.directive';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';

import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './shared/material.module';

defineLocale('en-gb', enGbLocale);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UnauthorizedComponent,
    AdminComponent,
    LogoutComponent,
    MinionsComponent,
    CommandsComponent,
    NavigationComponent,
    PageNotFoundComponent,
    ProfileComponent,
    ParametersComponent,
    MinionDetailComponent,
    CreateCommandComponent,
    ScheduleComponent,
    SearchBarComponent,
    CustomMinDirective,
    CustomMaxDirective,
    ResetPasswordComponent,
    NewUserComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    NgbPopoverModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    MDBBootstrapModule.forRoot()
    ],
  providers: [{provide: HTTP_INTERCEPTORS,
              useClass: HttpConfigInterceptor,
              multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
