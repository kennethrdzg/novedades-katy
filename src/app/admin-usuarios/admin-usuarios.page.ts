import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.page.html',
  styleUrls: ['./admin-usuarios.page.scss'],
})
export class AdminUsuariosPage implements OnInit {

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(8)]], 
    role: ['', [Validators.required]]
  })
  constructor(
    private firebase: FirebaseService, 
    protected router: Router, 
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if(!this.firebase.admin){
      this.router.navigate(['home']);
    }
  }

  crearUsuario(){
    this.firebase.crearUsuario(this.email?.getRawValue(), this.password?.getRawValue(), this.role?.getRawValue()).then(
      () => {
        this.router.navigate(['home']);
      }
    );
  }

  get email(){
    return this.userForm.get('email');
  }

  get password(){
    return this.userForm.get('password');
  }

  get role(){
    return this.userForm.get('role');
  }
}
