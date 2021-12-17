import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BloodSugarComponent } from './blood-sugar/blood-sugar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    HomeComponent,
    LogoutComponent,
    BloodSugarComponent
  ],
  imports: [
    BrowserModule, MatSnackBarModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,
    AppRoutingModule, FormsModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, MatNativeDateModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
