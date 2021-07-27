import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {delay, map, retry} from 'rxjs/operators'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  private host_url: string = environment.API_URL
  constructor(private http: HttpClient) { }

  public checkIfNricExists(nric: string): Observable<Boolean> {

    return this.http.get<Boolean>(`${this.host_url}/user/exist?nric=${nric}`).pipe(delay(1000));
  }

  public checkIfEmailExists(email: string): Observable<Boolean> {
    
    return this.http.get<Boolean>(`${this.host_url}/user/exist?email=${email}`).pipe(delay(1000));
  }


  nricValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfNricExists(control.value).pipe(
        map(res => {
          return res ? null : {nricExists:false}
        })
      )
    }
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEmailExists(control.value).pipe(
        map(res => {
          console.log(res)
          return res ?  {emailExists:true} : null
        })
      )
    }
  }
}


