import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import {event} from '../models/event';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private http: HttpClient, private _auth: AuthService) { }

  private socket;

  public initSocket(): void {
      this.socket = socketIo(environment.API_URL+'/chat'); //environment.API_URL
  }

  public send(message: any): void {
    this.socket.emit('message', message);
  }

  public post_in_room(room:String, message: any): void {
    this.socket.emit(room, message);
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('message', (data: any) => observer.next(data));
    });
  }

  public onStatus(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('status', (data: any) => observer.next(data));
    });
  }

  public onEvent(event: event): Observable<any> {
      return new Observable<event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }

  listMessages() {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
      };
    var emp_id = this._auth.getUserEmployeeId;
    return this.http.get(environment.API_URL + '/chat/messages/'+String(emp_id)+'/', headers);
  }

  addEmployeeToRoom(room_id:number, emp_id:number){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      employee_id: emp_id
    };
    return this.http.post<any>(environment.API_URL + '/chat/room/'+room_id+'/', data, headers)
  }

  createNewRoom(room_name:string, room_type:string){
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': this._auth.getUserToken })
    };
    const data = {
      name: room_name,
      type: room_type
    };
    return this.http.post<any>(environment.API_URL + '/chat/room', data, headers)
  }
}
