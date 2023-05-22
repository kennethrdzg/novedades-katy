import { Component, OnInit} from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private db: FirebaseService) {}
  get_inventario(){
    this.db.getInventario().subscribe(
      res => {
        console.log(res);
      }
    );
  }
  ngOnInit(){
    console.log('Hello')
    this.get_inventario();
  }
}
