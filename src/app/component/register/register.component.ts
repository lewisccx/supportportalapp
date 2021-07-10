import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from './../../service/auth.service';
import { NotificationService } from './../../service/notification.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Form, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  showLoading = false;
  salutation= "mr";
  private subscriptions: Subscription[] = [];
  
  @ViewChild('registerForm', {static: false}) registerForm!: NgForm;
  constructor(private router: Router, 
    private authService: AuthService, 
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigateByUrl('/user/management');
    }
    
  }

  onRegister(user: User):void {
    console.log(user);
    this.showLoading = true;
    this.subscriptions.push(
      this.authService.register(user).subscribe(
        (response: HttpResponse<User>) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `An acount has created for ${response.body?.email}. Please log in`);
          this.registerForm.resetForm();
          this.registerForm.controls['salutation'].patchValue("mr")
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.showLoading = false
        }
      )

    )
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
