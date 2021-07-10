import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Role } from '../model/role';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private host_url: string = environment.API_URL
  constructor(private http : HttpClient) { }

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.host_url}/role/list`);
  }

  public getCompatibleRoles( roleOid: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.host_url}/role/combo/${roleOid}`)
  }
}
