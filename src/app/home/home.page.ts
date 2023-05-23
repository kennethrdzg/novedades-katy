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

  constructor(private firebase: FirebaseService, 
    private router: Router) {
    /*const auth = getAuth();
    auth.onAuthStateChanged( (user) =>{
      if(!user){
        this.router.navigate(['login'])
      }
    })*/
  }
  ngOnInit(){
  }
  logOut(){
    this.firebase.logOut();
  }
}
