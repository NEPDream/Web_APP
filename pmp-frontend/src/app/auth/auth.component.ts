import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  
  loginForm: FormGroup;
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  show_registration = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private _auth: AuthService,
              private toast: ToastrService, 
              private _router: Router) { 
                // redirect to home if already logged in
                  if (this._auth.isAuthenticated) { 
                    //this.router.navigate(['/issues']);
                     console.log('already loogedIn')
                }
              }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registrationForm = this.formBuilder.group({
      name : ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      profile: ['', Validators.required],
      skills: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this._auth.loginUser(this.f.username.value, this.f.password.value).subscribe(
          data => {
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.error = error;
            this.loading = false;
      });
  }

  // convenience getter for easy access to form fields
  get r() { return this.registrationForm.controls; }
  onSubmitRegistration(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
        return;
    }
    console.log(this.r);
    var newUserData={
      name: this.r.name.value,
      email: this.r.email.value,
      password: this.r.password.value,
      admin: false,
      profile: this.r.profile.value,
      skills: this.r.skills.value.split(',')
    }
    this._auth.createNewUser(newUserData).subscribe(
      data => {
        this.toast.success('Success',  'New User Well Created, Now You can login !', {
          closeButton: true
        });
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.toast.error('Error',  'Fail to Create the New User'+ error, {
          closeButton: true
        });
      }
    );
    this.submitted= false;
    this.showRegister();    
  }

  showRegister(){
    this.show_registration = !this.show_registration;
  }
  

}
