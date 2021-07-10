import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';


import { environment } from './../../environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public host_url: string = environment.API_URL
  private token: any;
  private loggedInUsername: any;
  private jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {}


  public login(user: User): Observable<HttpResponse<User>>{
    return this.http.post<User>
    (`${this.host_url}/user/login`, user, {observe:'response'});
  }

  public register(user: User): Observable<HttpResponse<User>>{
    return this.http.post<User>
    (`${this.host_url}/user/register`, user, {observe:'response'});
}

  public logout():void{
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }
  
  public getToken(): string {
    return this.token;
  }

  public isLoggedIn(): boolean {
    var validLoggedIn = false;
    this.loadTokenFromLocalStorage();
    if(this.token != null && this.token !==''){
      if(this.jwtHelper.decodeToken(this.token).sub != null || ''){
        if(!this.jwtHelper.isTokenExpired(this.token)){
            this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
            validLoggedIn = true;
        }
      }
    }else{
      this.logout();
      validLoggedIn = false;
    }
    return validLoggedIn;
  }

  public saveTokenToLocalStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public loadTokenFromLocalStorage(): void {
    this.token = localStorage.getItem('token');
    
  }
  public AddUserToLocalStorage(user: User): void{
      localStorage.setItem('user',JSON.stringify(user));

  }

  public getUserFromLocalStorage(user: User): User {
    return JSON.parse(localStorage.getItem('user')!);
  }

}
