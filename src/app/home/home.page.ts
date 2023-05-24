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
  }
  ngOnInit(){
  }
  logOut(){
    this.firebase.logOut();
  }
}
