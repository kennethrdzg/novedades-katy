import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

//Firebase
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword} from 'firebase/auth'
import { Router } from '@angular/router';
import {environment} from '../environments/environment.prod'
import { Producto } from './producto';
import { getDatabase, ref, push, onValue, child, get, set} from 'firebase/database';
import { Ticket } from './ticket';
import { TicketProducto } from './ticket-producto';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  logged_user: any
  admin: boolean = false;
  constructor(private http: HttpClient, private router: Router) {
    const auth = getAuth();
    auth.onAuthStateChanged( (user) => {
      this.admin = false;
      if(!user){
        router.navigate(['login']);
      }
      else{
        this.getRol()?.then(
          respuesta => {
            if(respuesta.exists()){
              let values = respuesta.val();
              this.admin = (values['rol'] == 'admin');
            }
          }
        ).catch( err => {
          alert(err);
        })
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
      this.logged_user = user
    })
    .catch( (err) => {
      alert(err);
    });
  }

  logOut(){
    const auth = getAuth();
    signOut(auth).then( () => {
      alert("Sign-out succesful");
    }).catch( (err) => {
      alert(err);
    })
  }

  //Inventario
  getProductoPorId(id: string){
    const databaseRef = ref(getDatabase());
    return get(child(databaseRef, '/productos/' + id));
  }
  
  cargarProductoNuevo(nuevo_producto: Producto){
    const database = getDatabase();
    return push(ref(database, 'productos/'), nuevo_producto);
  }

  crearTicket(fecha: string, ingreso: number){
    const auth = getAuth();
    if(auth.currentUser != null){
      let ticket: Ticket = {
        id_empleado: auth.currentUser.uid, 
        fecha:fecha, 
        ingreso: ingreso
      }
      const database = getDatabase();
      return push(ref(database, 'tickets'), ticket)
    }
    return null;
  }

  cargarTicketProducto(ticket_producto: TicketProducto){
    const auth = getAuth(); 
    if(auth.currentUser != null){
      const database = getDatabase(); 
      return push(ref(database, 'ticket_productos'), ticket_producto);
    }
    return null;
  }

  getRol(){
    const auth = getAuth();
    const databaseRef = ref(getDatabase());

    if(auth.currentUser == null){
      return;
    };
    return get(child(databaseRef, 'empleados/'+auth.currentUser.uid));
  }

  getEsAdmin(){
    return this.admin;
  }

  buscarProductoPorId(id: string){
    const databaseRef = ref(getDatabase());
    return get(child(databaseRef, 'productos/' + id));
  }

  buscarProductoPorNombre(nombre: string){
    let productos: Producto[] = []
    const databaseRef = ref(getDatabase());
    get(child(databaseRef, 'productos'));
  }

  getTickets(){
    const databaseRef = ref(getDatabase());

    return get(child(databaseRef, 'tickets'));
  }

  crearUsuario(email: string, password: string, role: string){
    const auth = getAuth();
    const database = getDatabase();
    createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        alert('Usuario creado exitosamente. Ingresando a su cuenta.');
        set(ref(database, 'empleados/'+uid), {'rol': role}).catch(
          err => {
            alert('Error al asignar rol al usuario, contacte con su administrador');
          }
        )
      }
    ).catch(
      err => {
        alert(err.message);
      }
    )
  }

  actualizarProducto(producto_id: string, parametro: string, valor: any){
    const databaseRef = ref(getDatabase(), 'productos/'+producto_id+'/'+parametro);
    return set(databaseRef, valor);
  }
}
