import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient, private _auth: AuthService) { }

  listEmployees() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/employee/', headers)
  }

  listUnEmployed() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/user/unemployed/', headers)
  }


  createNewEmployee(data:any){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    // const data = {
    //   "badge": "Wfo1325",
    //   "start_date":"2019-02-19 13:10:00",
    //   "end_date":"2019-07-19 13:10:00",
    //   "is_full_time": false,
    //   "user_id":4,
    //   "role_id" : 1,
    //   "team_id":1,
    //   "company_id":1,
    //   "active": true
    // };
    return this.http.post<any>(environment.API_URL + '/employee/', data, headers)
  }

  updateEmployee(data:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
      // const data = {
      //   "badge": "Wfo1325",
      //   "start_date":"2019-02-19 13:10:00",
      //   "end_date":"2019-07-19 13:10:00",
      //   "is_full_time": false,
      //   "role_id" : 1,
      //   "active": true,
      //   "id": 12
      // };
    return this.http.put<any>(environment.API_URL + '/employee/'+data.id+'/', data, headers)
  }
}
