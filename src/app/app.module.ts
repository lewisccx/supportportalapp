import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS }  from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { RoleService } from './service/role.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
 
  BrowserModule,
    HttpClientModule,
    NotificationModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    AppRoutingModule
  ],
  providers: [NotificationService, AuthGuard, AuthService, UserService, RoleService, {
    provide: HTTP_INTERCEPTORS, 
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
