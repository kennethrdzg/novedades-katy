import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required]]
  })

  constructor(
    private firebase: FirebaseService, 
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
  }

  login(){
    this.firebase.logIn(this.email?.getRawValue(), this.password?.getRawValue());
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }
}
