import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private _auth: AuthService) { }

  listProjects() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/project/', headers)
  }

  createNewProject(data:any){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    // const data = {
    //   name: "Deplopy Cloudfront And Proxy",
    //   start_date:"2019-02-20 13:10:00",
    //   due_date:"2019-04-30 13:10:00",
    //   comment: "The goal of this project is to deploy Cloudfront to handle IAAS",
    //   company_id:2,
    //   teams : [3]
    // };
    return this.http.post<any>(environment.API_URL + '/project/', data, headers)
  }

  updateProject(data:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    // const data = {
    //   name: "Deplopy Cloudfront And Proxy",
    //   start_date:"2019-02-20 13:10:00",
    //   due_date:"2019-04-30 13:10:00",
    //   comment: "The goal of this project is to deploy Cloudfront to handle IAAS",
    // }
    return this.http.put<any>(environment.API_URL + '/project/'+data.id+'/', data, headers)
  }
}
