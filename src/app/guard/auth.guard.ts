import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthService } from './../service/auth.service';
import { NotificationService } from './../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, 
    private router: Router,
    private notificationService: NotificationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isUserLoggedIn();
  }
  

  private isUserLoggedIn(): boolean {
    
    if(this.authService.isLoggedIn()){
      return true;
    }
   
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, `login required`.toUpperCase())
    return false;
  }
}
