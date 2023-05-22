import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = this.fb.group({
    email: [''], 
    password: ['']
  })

  constructor(
    private db: FirebaseService, 
    private fb: FormBuilder, private router: Router
  ) {
    const auth = getAuth();
    auth.onAuthStateChanged( (user) => {
      if(user){
        router.navigate(['home'])
      }
    });
  }

  ngOnInit() {
  }

  login(){
    this.db.logIn(this.email?.getRawValue(), this.password?.getRawValue());
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }
}
