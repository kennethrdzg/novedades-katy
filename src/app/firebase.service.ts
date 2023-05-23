import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

//Firebase
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'
import { Router } from '@angular/router';
import {environment} from '../environments/environment.prod'
import { Producto } from './producto';
import { getDatabase, ref, push, onValue, child, get} from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  logged_user: any
  constructor(private http: HttpClient, private router: Router) {
    const auth = getAuth();
    auth.onAuthStateChanged( (user) => {
      if(!user){
        router.navigate(['login']);
      }
      else{
        if(router.url == '/login'){
          router.navigate(['home']);
        }
        else{
          router.navigate([router.url]);
        }
      }
    })
  }

  getInventario(){
    const databaseRef= ref(getDatabase());
    return get(child(databaseRef, 'productos'));
  }

  logIn(email: string, password: string){
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then( (userCredential) => {
      //Signed In
      const user = userCredential.user;
    })
    .catch( (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error code: " + errorCode)
      console.error(errorMessage);
    });
  }

  logOut(){
    const auth = getAuth();
    signOut(auth).then( () => {
      console.log("Sign-out succesful");
    }).catch( (error) => {
      console.error(error.code);
      console.error(error.message);
    })
  }

  //Inventario
  getProductoPorCodigo(codigo: string){
    return this.http.get(environment.firebaseConfig.databaseURL + '/productos/' + codigo + '.json')
  }
  
  cargarProductoNuevo(nuevo_producto: Producto){
    const database = getDatabase();
    return push(ref(database, 'productos/'), nuevo_producto)
    //return this.http.post(environment.firebaseConfig.databaseURL + '/productos.json', nuevo_producto);
  }
}
