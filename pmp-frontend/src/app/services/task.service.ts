import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private _auth: AuthService) { }

  listTask() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/task/', headers)
  }

  getOnetask(id:number) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    return this.http.get(environment.API_URL + '/task/'+id+'/', headers)
  }

  createTask(task:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    return this.http.post<any>(environment.API_URL + '/task/', task, headers)
  }

  createSprint(sprint_data:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    return this.http.post<any>(environment.API_URL + '/sprint/', sprint_data, headers)
  }

  updateSprint(id:string, sprint_data:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    return this.http.put<any>(environment.API_URL + '/sprint/'+id+'/', sprint_data, headers)
  }

  updateTask(id:string, task:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    return this.http.put<any>(environment.API_URL + '/task/'+id+'/', task, headers)
  }

  changeTaskStage(id:string, stage:string) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      new_stage : stage,
      employee_id: this._auth.getUserEmployeeId
    };
    return this.http.put<any>(environment.API_URL + '/task/'+id+'/', data, headers)
  }

  deleteTask(id:string) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };    
    return this.http.delete<any>(environment.API_URL + '/task/'+id+'/', headers)
  }

  createIssueFromTask(id:number, task:any) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    return this.http.post<any>(environment.API_URL + '/task/'+id+'/', task, headers)
  }

  addCommentToTask(id:number, comment:any){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      comment : comment['comment'], 
      employee_id: comment['employee_id']
    };

    return this.http.post<any>(environment.API_URL + '/task/tracking/'+id+'/', data, headers)
  }

}
