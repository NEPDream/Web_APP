import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router' 


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = 'currentUser';

  constructor( private http: HttpClient, private _router: Router ) { 

   }

  getSomeThing(){
    return console.log('we send you something from the auth service');
  }

  public get currentUserValue(): JSON {
    return JSON.parse(localStorage.getItem(this.currentUser));
  }

  public get isAuthenticated() {
    return !!localStorage.getItem(this.currentUser);
  }
  
  public get getUserToken(): string{
    if (this.isAuthenticated){
      var token = this.currentUserValue['token']
      return token;
    }
    return '';
  }

  public get getusername(): string{
    if (this.isAuthenticated){
      var username = this.currentUserValue['username']
      return username;
    }
    return '';
  }

  public get getUserEmployeeId(): any{
    if (this.isAuthenticated){
      var employee_id = this.currentUserValue['employee_id']
      return employee_id;
    }
    return false;
  }

  loginUser(username, password) {
    const data = {
      username : username,
      password: password
    };
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' })
      };
    return this.http.post<any>(environment.API_URL + '/login', data, headers)
  }

  logoutUser() {
    localStorage.removeItem('currentUser')
    this._router.navigate(['/login'])
  }

  public login(username: string, password: string) {
    const headers_1 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this.getUserToken })
      };

    this.http.get(environment.API_URL + '/user/', headers_1)
    .subscribe((res) => {
      console.log(res);
    }, (err:HttpErrorResponse) => {
        console.log(err)
     });

     const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' })
      };
      const data = {
        username : username,
        password: password
      };

      this.http.post(environment.API_URL + '/login', data, headers).subscribe((res) => {
        console.log(res);
        localStorage.setItem(this.currentUser, JSON.stringify(res));
      }, (err:HttpErrorResponse) => {
          console.log(err)
      });
  }

  createNewUser(userData:any){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post<any>(environment.API_URL + '/user/', userData, headers)
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
