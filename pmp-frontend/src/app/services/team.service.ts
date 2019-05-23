import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient, private _auth: AuthService) { }


  listTeams() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/team/', headers)
  }

  createNewTeam(name:string, comment:string, company_id:number){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      name : name,
      comment: comment,
      company_id: company_id
    };
    return this.http.post<any>(environment.API_URL + '/team/', data, headers)
  }

  updateTeam(id:string, name:string, comment:string) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      name : name,
      comment: comment
    };
    return this.http.put<any>(environment.API_URL + '/team/'+id+'/', data, headers)
  }

}
