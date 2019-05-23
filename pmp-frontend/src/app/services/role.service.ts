import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private _auth: AuthService) { }

  listRoles() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/role/', headers)
  }

  createNewRole(name:string, comment:string){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      name : name,
      comment: comment
    };
    return this.http.post<any>(environment.API_URL + '/role/', data, headers)
  }

  updateRole(id:string, name:string, comment:string) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      name : name,
      comment: comment
    };
    return this.http.put<any>(environment.API_URL + '/role/'+id+'/', data, headers)
  }

}
