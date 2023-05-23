import { Component} from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  admin: boolean = false;
  constructor(private firebase: FirebaseService, 
    protected router: Router) {
      this.getRol();
  }
  ngOnInit(){
  }
  logOut(){
    this.firebase.logOut();
  }

  getRol(){
    console.log("Test")
    this.firebase.getRol()?.then(
      respuesta => {
        console.log(respuesta);
      }
    ).catch( err => {
      console.log(err);
    })
  }
}
