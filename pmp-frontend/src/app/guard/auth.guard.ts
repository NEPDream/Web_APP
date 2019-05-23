import { Injectable } from '@angular/core';
import {AuthService} from '../services/auth.service'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  
  constructor(private _router: Router,private _auth: AuthService) { }

  canActivate(): boolean {
    if (this._auth.isAuthenticated) {
      console.log('true')
      return true
    } else {
      console.log('false')            
      this._router.navigate(['/login'])
      return false
    }
  }



}
