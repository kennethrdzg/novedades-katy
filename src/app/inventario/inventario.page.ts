import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Producto } from '../producto';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  productos: Producto[] = [];
  num_paginas: number = 0;
  productos_por_pagina = 2;
  pagina_actual = 1;
  ultima_pagina = 1;
  constructor(
    private firebase: FirebaseService, 
    private route: ActivatedRoute, 
    private router: Router) {
      /*const auth = getAuth();
      auth.onAuthStateChanged( (user) => {
        if(!user){
          router.navigate(['login']);
        }
      });*/
  }

  ngOnInit() {
    this.getInventario();
  }

  getInventario(){
    this.firebase.getInventario().then(
      snapshot => {
        if(snapshot.exists()){
          let values = snapshot.val();
          for(let key in values){
            let value = values[key];
            this.productos.push(value);
          }
          this.ultima_pagina = Math.ceil(this.productos.length / this.productos_por_pagina);
          this.actualizarPaginaActual();
        }
        /*
        for(let key in response){
          let r = response[key as keyof typeof response];
          this.productos.push(r);
        }
        this.ultima_pagina = Math.ceil(this.productos.length / this.productos_por_pagina);
        this.actualizarPaginaActual();
        */
      }
    );
  }
  actualizarPaginaActual(){
    this.pagina_actual = Number(this.route.snapshot.params['id']);
    if(this.pagina_actual > this.ultima_pagina){
      this.pagina_actual = this.ultima_pagina;
    }

    if(this.pagina_actual < 1){
      this.pagina_actual = 1;
    }
  }
  mostrarInventarioSiguiente(){
    this.pagina_actual ++;
    this.pagina_actual = Math.min(this.pagina_actual, this.ultima_pagina);
    this.router.navigate(['/inventario', this.pagina_actual]);
    this.actualizarPaginaActual()
  }
  mostrarInventarioAnterior(){
    this.pagina_actual --;
    this.pagina_actual = Math.max(1, this.pagina_actual);
    this.router.navigate(['/inventario', this.pagina_actual]);
    this.actualizarPaginaActual();
  }
}
