import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';
import { BloodSugarComponent } from './blood-sugar/blood-sugar.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate : [ AuthService ] },
  { path: 'bSugar', component: BloodSugarComponent, canActivate : [ AuthService ] },
  { path: 'logout', component: LogoutComponent, canActivate : [AuthService] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: ErrorComponent, data: { msg: 'Undefined Route' }, canActivate : [ AuthService ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
