import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../model/custom-http-response';
import { User } from '../model/user';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host_url: string = environment.API_URL
  constructor(private http :HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host_url}/user/list`);
  }

  public updateUser(formData: FormData): Observable<User>{
    return this.http.post<User>(`${this.host_url}/user/update`, formData);
  }

  public deleteUser(nric: String): Observable<CustomHttpResponse | HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host_url}/user/delete/${nric}`);
  }

  public addUsersToLocalStorage(users: User[]): void{

    localStorage.setItem('users', JSON.stringify(users));

  }

  public getUsersFromLocalStorage(): User[] | null{
   

    if(localStorage.getItem('users')){
    return  JSON.parse(localStorage.getItem('users')!)
     
    }
    return null;
  }

  public createUserFormData(user: User): FormData {
      const formData = new FormData();
    
      formData.append('nric', user.nric);
      formData.append('staffId', user.staffId);
      formData.append('name', user.name);
      formData.append('salutation', user.salutation)
      formData.append('userInitial', user.userInitial);
      formData.append('contactNo', user.contactNo);
      formData.append('contactExt', user.contactExt);
      formData.append('faxNo', user.faxNo);
      formData.append('email', user.email);
      formData.append('userInitial', user.userInitial);
      formData.append('dteExpire', user.dteExpire);
      formData.append('displayName', user.displayName);
      formData.append('appt', user.appt);
      formData.append('locked', JSON.stringify(user.locked));
      formData.append('user', JSON.stringify(user.roleSet));
      return formData;
      
  }

}
 