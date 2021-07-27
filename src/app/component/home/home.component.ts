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

import { ValidatorService } from 'src/app/service/validator.service';
import { pageUser } from 'src/app/model/pageUser';
import { query } from '@angular/animations';


declare const $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private tabSubject = new BehaviorSubject<string>('Users');
  public selectedUser?: User;
  public userAccessControlRequestForm!: FormGroup
  public searchForm!: FormGroup
  public tabAction$ = this.tabSubject.asObservable();
  private subscriptions: Subscription[] = []
  public users: User[] = [];
  public pageObject: pageUser = { payload: [], currentPage: 0, totalItems: 0, totalPage: 0 }
  public page = 0;
  public pages: Array<number> = [];
  public pageSize = 5;
  public collectionSize = 0;
  public previousDisabled = true;
  public nextDisabled = true;
  public filter ='';
  isSubmitted = false;
  isRolesDdlOpened = true;
  refresh?: boolean = false;
  dropdownList: any = [];
  selectedItems: any = [];
  firstSelectedItem: any = []
  dropdownSettings = {};
  initialLoad = true;
  @ViewChild('addUserModal') addUserModal?: ElementRef;
  @ViewChild('viewUserModal') viewUserModal?: ElementRef;
  @ViewChild('rolesDropDownList') rolesDropDownList?: ElementRef
  @ViewChild('closeModalBtn') closebutton?: ElementRef
  salutationNames: any = ['Mr', 'Ms']
  default: string = "Mr"

  sorted = false
  sortNameClick = false
  constructor(private userService: UserService,
    private roleService: RoleService,
    private notificationService: NotificationService,
    private validatorService: ValidatorService,
    // private location: Location ,
    private fb: FormBuilder) {
    //this.location.subscribe(() => {
    //close popup
    // if (typeof $ !== 'undefined') {
    //   $(this.addUserModal!.nativeElement).modal('hide');
    //   $(this.viewUserModal!.nativeElement).modal('hide');
    // }
    //});
    this.prepareForm()
    this.searchForm = this.fb.group({
      query: ['',[Validators.required]]
    })
  }



  get roleSet() {
    return this.userAccessControlRequestForm.get('roleSet')!;
  }

  get email() {
    return this.userAccessControlRequestForm.get('email')!;
  }
  get nric() {
    return this.userAccessControlRequestForm.get('nric')!;
  }

  get salutation() {
    return this.userAccessControlRequestForm.get('salutation')!;
  }
  prepareForm(): void {
    this.userAccessControlRequestForm = this.fb.group({
      salutation: [''],
      nric: [null, { validators: [Validators.required], asyncValidators: [this.validatorService.nricValidator()], updateOn: 'blur' }],
      name: ['', [Validators.required]],
      userInitial: ['', [Validators.required]],
      email: [null, { validators: [Validators.email, Validators.required], asyncValidators: [this.validatorService.emailValidator()], updateOn: 'blur' }],
      displayName: ['', [Validators.required]],
      appt: ['', [Validators.required]],
      roleSet: [[], [Validators.required]]

    })

  
  }

  onUserNameSort() {  
    if (!this.sortNameClick) {
      this.sortNameClick = true
    }
    this.sorted  = !this.sorted
    this.filter = "name";
    if(this.users.length > 1){
      this.getUsers(false, this.filter, this.sorted);
    }
 
    console.log("sortNameClick: " + this.sortNameClick)
  }


  onOpen(evt: any) {
    this.isRolesDdlOpened = evt;
  }
  onClose(evt: any) {
    this.isRolesDdlOpened = evt;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );

  }
  ngOnInit(): void {

    this.getUsers(false);

    this.getRoles();

    this.selectedItems = [];
    this.userAccessControlRequestForm.patchValue({
      'salutation': this.default
    });
    this.dropdownSettings = {

      text: "Select roles",
      selectAllText: 'Select All',
      singleSelection: false,
      unSelectAllText: 'UnSelect All',
      primaryKey: "roleOid",
      labelKey: "role",
      classes: "myclass custom-class",
      enableSearchFilter: true,
      searchBy: ['role']
    };
  }
  public changeTitle(title: string): void {
    this.tabSubject.next(title);
  }
  public getRoles(): void {
    //this.subscriptions.push(
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
    //  )
  }

  calculateIndex(index: number): number {

    return 0;
  }
  onPageClick(i: number, event: any) {
    event.preventDefault();
    this.page = i
    // this.page =  page == undefined ? 0 : page -1   
    this.getUsers(false, this.filter, this.sorted)
  }
  onPreviousClick(event: any) {
    event.preventDefault();
    this.page = this.page - 1
    this.getUsers(false, this.filter, this.sorted);
  }

  public refreshList(): void {
    this.sortNameClick = false;
    //this.refresh = true;
    this.getUsers(false);
   // this.refresh = false;
    console.log("sortNameClick: " + this.sortNameClick)


  }

  onSearch(): void {
    console.log(this.searchForm.get('query')?.value)
     var query =this.searchForm.get('query')?.value
    this.getUsers(false, undefined, undefined, query );
  }
  public getUsers(showNotification: boolean,  filter?: string, sorted?: boolean, query?: string ): void {
   
    this.subscriptions.push(

      this.userService.getUsers(this.page, filter, sorted, this.searchForm.get('query')?.value).subscribe(
     
        (response: pageUser) => {

          this.userService.addUsersToLocalStorage(response.payload);
          //console.log(response)

          this.pages = [...Array(response.totalPage).keys()]

          this.users = response.payload;
          // console.log(this.page)
          // console.log(this.pages[0])
          if (this.page > this.pages[0]) {

            this.previousDisabled = false
          } else {
            this.previousDisabled = true
          }
          //console.log("current page: "+ this.page)
          //console.log("last page: "+ this.pages)
          if (this.page == this.pages[this.pages.length-1]) {
           
            this.nextDisabled = true
          } else {
            this.nextDisabled = false
          }

          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.payload.length} user(s) loaded successfully`)
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
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured, Please try again');
      this.refresh = false;

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
      this.userService.updateUser(this.userAccessControlRequestForm.value).subscribe(
        (response: User) => {

          this.selectedItems = []
          this.prepareForm()
          this.userAccessControlRequestForm.get('salutation')!.patchValue(this.default)

          this.closebutton?.nativeElement.click()
          this.sendNotification(NotificationType.SUCCESS, `User ${response.name} Updated successfully`)
          this.getUsers(false);
          this.getRoles();
        },
        (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, err.error.message)
        }
      )
    }
  }
  changeSalu(event: any): void {

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
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    if (this.selectedItems.length == 0) {
      this.userAccessControlRequestForm.get("roleSet")!.setErrors({ 'empty': true })
    } else {
      this.userAccessControlRequestForm.get("roleSet")!.setErrors(null)
    }
    this.firstSelectedItem = item
    if (this.selectedItems.length == 1) {
      this.getCompatibleRoles(item);
    }

  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    if (this.selectedItems.length == 0) {
      this.userAccessControlRequestForm.get("roleSet")!.setErrors({ 'empty': true })
    } else {
      this.userAccessControlRequestForm.get("roleSet")!.setErrors(null)
    }
    if (this.selectedItems.length == 0) {
      this.getRoles();
    }

    if (this.selectedItems.length == 1) {
      this.getCompatibleRoles(this.selectedItems[0]);
    }

  }


  onSelectAll(items: any) {
    console.log(items);
    console.log("selected item:" + this.selectedItems.role)
    this.selectedItems = [].concat(this.firstSelectedItem, items);

    if (this.selectedItems.length > 4) {
      this.selectedItems = [];
      this.sendNotification(NotificationType.WARNING, "Invalid roles selected")

    }
  }
  onDeSelectAll(items: any) {
    console.log(this.dropdownList)
    console.log(items);
    this.getRoles()
  }
  onCloseModal() {
    this.userAccessControlRequestForm.get("roleSet")!.setErrors(null)
  }
}
