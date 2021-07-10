import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from './../../service/auth.service';
import { NotificationService } from './../../service/notification.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HeaderType } from 'src/app/enum/header-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  showLoading : boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, 
    private authService: AuthService, 
    private notificationService: NotificationService) { }
   

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigateByUrl('/user/management');
    }else{
      this.router.navigateByUrl('/login');
    }
  }
 
  onLogin(user: User): void{
      this.showLoading  = true;
      console.log(user); 
      this.subscriptions.push(
        this.authService.login(user).subscribe(
          (response: HttpResponse<User> ) => {
              console.log(response);
              const token = response.headers.get(HeaderType.JWT_TOKEN)!;
              this.authService.saveTokenToLocalStorage(token);
              this.authService.AddUserToLocalStorage(response.body!);
              this.router.navigateByUrl('/user/management');
              this.showLoading = false;
              this.sendNotification(NotificationType.SUCCESS, `Welcome, ${response.body?.email}`)

            },
            (error : HttpErrorResponse)=> {
              console.log(error);
              this.sendNotification(NotificationType.ERROR, error.error.message)
              this.showLoading = false;
            }
        )
      );
  }
  sendNotification(notificationType: NotificationType, message: string) {
    if(message){
      this.notificationService.notify(notificationType, message);
    }else{
      this.notificationService.notify(notificationType, 'An error occured, Please try again');

    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );
  }

}
