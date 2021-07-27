import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../model/custom-http-response';
import { pageUser } from '../model/pageUser';
import { User } from '../model/user';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host_url: string = environment.API_URL
  constructor(private http :HttpClient) { }

  public getUsers(currentPage? : number, filter?: string, sorted?: boolean, query?: string): Observable<pageUser> {
    //if(currentPage !== undefined){
      console.log(filter, query)
      if(filter !== undefined){
        //console.log("filter and sorted in user service: ",filter + " " + sorted + " "+ currentPage);
        return this.http.get<pageUser>(`${this.host_url}/user/list?filter=${filter}&sorted=${sorted}&page=${currentPage}`);
      }
      if(query !== undefined && query !== "") {
        //console.log("filter and sorted in user service: ",filter + " " + sorted + " "+ currentPage);
        return this.http.get<pageUser>(`${this.host_url}/user/list?query=${query}`);
      }
      if(filter !== undefined && query !== undefined && query !== ""){
        
        return this.http.get<pageUser>(`${this.host_url}/user/list?query=${query}&sorted=${sorted}&page=${currentPage}`);
      }
      
     
        return this.http.get<pageUser>(`${this.host_url}/user/list?page=${currentPage}`);
      
    
    //}
    
    // if(filter != null && sorted){
    //   console.log("filter and sorted in user service: ",filter + " " + sorted);
    //   return this.http.get<pageUser>(`${this.host_url}/user/list?filter=${filter}&sorted=${sorted}`);
    // }

   // return this.http.get<pageUser>(`${this.host_url}/user/list`);
  }

  public updateUser(formData: FormData): Observable<User>{
    return this.http.post<User>(`${this.host_url}/user/update`, formData);
  }

  public deleteUser(nric: String): Observable<CustomHttpResponse | HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host_url}/user/delete/${nric}`);
  }

  // public sortUser(filter: String, sorted: boolean): Observable<pageUser>{
  //   return this.http.p
  // }
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
 