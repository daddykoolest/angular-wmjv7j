import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AdminComponent } from './admin/admin.component';
import { RoleGuardService as RoleGuard } from './services/auth/role-guard.service';
import { MinionsComponent } from './minions/minions.component';
import { CommandsComponent } from './commands/commands.component';
import { LogoutComponent } from './logout/logout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ParametersComponent } from './parameters/parameters.component';
import { CreateCommandComponent } from './create-command/create-command.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MinionDetailComponent } from './minion-detail/minion-detail.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { NewUserComponent } from './newuser/newuser.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [RoleGuard]},
  {path: 'navigation', component: NavigationComponent},
  {path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { expectedRole: '1'}},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: 'login', component: LoginComponent},
  {path: 'minions', component: MinionsComponent, canActivate: [RoleGuard]},
  {path: 'commands', component: CommandsComponent, canActivate: [RoleGuard]},
  {path: 'logout', component: LogoutComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [RoleGuard]},
  {path: 'parameters/:id', component: ParametersComponent, canActivate: [RoleGuard]},
  {path: 'minion/:id', component: MinionDetailComponent, canActivate: [RoleGuard]},
  {path: 'create-command', component: CreateCommandComponent, canActivate: [RoleGuard]},
  {path: 'schedule', component: ScheduleComponent, canActivate: [RoleGuard]},
  {path: 'search-bar', component: SearchBarComponent, canActivate: [RoleGuard]},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'newuser', component: NewUserComponent, canActivate: [RoleGuard]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {useHash: true})]
})
export class AppRoutingModule { }
