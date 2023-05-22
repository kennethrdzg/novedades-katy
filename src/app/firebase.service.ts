import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

//Firebase
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'
import { Router } from '@angular/router';

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
    return this.http.get('https://novedades-katy-default-rtdb.firebaseio.com/productos.json');
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
}
