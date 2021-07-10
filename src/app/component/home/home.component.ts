import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from './../../service/user.service';
import { NotificationService } from './../../service/notification.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { RoleService } from './../../service/role.service';
import { Role } from 'src/app/model/role';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';
declare const $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private tabSubject = new BehaviorSubject<string>('Users');
  public selectedUser?: User;
  public tabAction$ = this.tabSubject.asObservable();
  private subscriptions : Subscription[] =[]
  public users: User[] = [];
  isSubmitted = false;
  isRolesDdlOpened = true;
  refresh: boolean = false;
  dropdownList: any = [];
  selectedItems :any = [];
  firstSelectedItem: any = []
  dropdownSettings = {};
  @ViewChild('addUserModal') addUserModal?: ElementRef;
  @ViewChild('viewUserModal') viewUserModal?: ElementRef;
  @ViewChild('rolesDropDownList') rolesDropDownList? : ElementRef

  salutationNames: any = ['mr', 'ms']
  default:string = "mr"

  constructor(private userService: UserService, 
    private roleService: RoleService,
    private notificationService: NotificationService,
   // private location: Location ,
    private fb: FormBuilder) {
      //this.location.subscribe(() => {
        //close popup
        // if (typeof $ !== 'undefined') {
        //   $(this.addUserModal!.nativeElement).modal('hide');
        //   $(this.viewUserModal!.nativeElement).modal('hide');
        // }
      //});
     // this.createForm()
    }
  
    userAccessControlRequestForm = this.fb.group({
      salutation: [''],
      nric:['',[Validators.required]],
      name:['',[Validators.required]],
      userInitial:['',[Validators.required]],
      email:['',[Validators.email, Validators.required]],
      displayName:['',[Validators.required]],
      appt:['',[Validators.required]],
      roleSet:[[], [Validators.required]]

    })

    get roleSet() {
      return this.userAccessControlRequestForm.get('roleSet')!;
    }

    get email() {
      return this.userAccessControlRequestForm.get('email')!;
    }

    // get rolesDropdownList() {
    //   return rolesDropDownList.
    // }
    onOpen(evt: any){
      this.isRolesDdlOpened = evt;
  }
  onClose(evt: any){
    this.isRolesDdlOpened = evt;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );
   
  }
  ngOnInit(): void {
      this.getUsers(true);
      this.getRoles();
    //   this.dropdownList = [
    //     { "id": 1, "itemName": "Angular" },
    //     { "id": 2, "itemName": "JavaScript" },
    //     { "id": 3, "itemName": "HTML" },
    //     { "id": 4, "itemName": "CSS" },
    //     { "id": 5, "itemName": "ReactJS" },
    //     { "id": 6, "itemName": "HTML5" }
    // ];
      this.selectedItems = [];
      this.userAccessControlRequestForm.patchValue({
        'salutation': this.default
      });
      this.dropdownSettings = { 
        
        text:"Select roles",
        selectAllText:'Select All',
        singleSelection: false,
        unSelectAllText:'UnSelect All',
        primaryKey: "roleOid",
        labelKey: "role",
        classes:"myclass custom-class",
        enableSearchFilter: true,
        searchBy: ['role']
      };  
  }
  public changeTitle(title: string): void {
    this.tabSubject.next(title);
  }
  public getRoles():void {
    this.subscriptions.push(
      this.roleService.getRoles().subscribe(
        (response: Role[]) => {
          //console.log(response)
            this.dropdownList = response;
            
            // response.map(r => {
            //   const obj :any= {}
            //   obj['id'] = r.roleOid
            //   obj['itemName'] = r.role
            //   this.dropdownList.push(obj)
            // })
        },
        (err: HttpErrorResponse) => {
          console.log(err)
        }
      )
    )
  }
  public getUsers(showNotification: boolean): void {
    this.refresh = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          //console.log(response);
          this.userService.addUsersToLocalStorage(response);
          this.users = response;
          this.refresh = false;
          if(showNotification){
              this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully`)
          }

        },
        (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, err.error.message)

        }
      )
    )

  } 

  onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    const modal = document.getElementById('openUserInfo')!
    modal.click();
  }

  sendNotification(notificationType: NotificationType, message: string) {
    if(message){
      this.notificationService.notify(notificationType, message);
    }else{
      this.notificationService.notify(notificationType, 'An error occured, Please try again');
      this.refresh= false;

    }
  }
 
  onAddUser(user: User): void {
    
  }
  onSubmit() {
    this.isSubmitted = true;
    console.log(this.userAccessControlRequestForm.value)
    if (!this.userAccessControlRequestForm.valid) {
      return;
    } else {
      console.log(this.userAccessControlRequestForm.value)
    }
  }
  changeSalu(event: any):void {

  }

  getCompatibleRoles(item: any): void {
    this.subscriptions.push(
      this.roleService.getCompatibleRoles(item.roleOid).subscribe(
        (response: Role[]) => { 
          this.dropdownList = response;
        },
        (err: HttpErrorResponse) => {
          console.log(err)
        }
      )
    )
  }
  onItemSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
    this.firstSelectedItem  = item
    if(this.selectedItems.length == 1){
      this.getCompatibleRoles(item);
    }
   
}
OnItemDeSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
    if(this.selectedItems.length == 0){
      this.getRoles();
    }

    if(this.selectedItems.length == 1){
      this.getCompatibleRoles(this.selectedItems[0]);
    }
 
}


onSelectAll(items: any){
    console.log(items);
    console.log("selected item:" + this.selectedItems.role)
    this.selectedItems = [].concat(this.firstSelectedItem, items);

    if(this.selectedItems.length > 4){
      this.selectedItems = [];
      this.sendNotification(NotificationType.WARNING, "Invalid roles selected")
  
    }
}
onDeSelectAll(items: any){
   console.log(this.dropdownList)
    console.log(items);
    this.getRoles()
}
}
