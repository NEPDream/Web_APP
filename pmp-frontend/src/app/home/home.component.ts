import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private AuthService : AuthService) { }

  ngOnInit() {
    /* console.log("user is authenticated ? " + this.AuthService.isAuthenticated)
    console.log("current user ")
    console.log(this.AuthService.currentUserValue)
    console .log(this.AuthService.getUserToken)*/
  }

}
