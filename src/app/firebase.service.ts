import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http: HttpClient) {}

  getInventario(){
    return this.http.get('https://novedades-katy-default-rtdb.firebaseio.com/productos.json');
  }
}
