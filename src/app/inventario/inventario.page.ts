import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  productos: Producto[] = [];
  codigos_productos: string[] = [];
  num_paginas: number = 0;
  productos_por_pagina = 2;
  pagina_actual = 1;
  ultima_pagina = 1;

  admin: boolean = false;
  constructor(
    protected firebase: FirebaseService, 
    private route: ActivatedRoute, 
    protected router: Router) {
      console.log('test 2')
  }

  async ngOnInit() {
    console.log('test 1')
    await this.getInventario();
  }

  ngAfterViewChecked(){
    console.log('After View')
    this.toBardCode();
  }
  /*
  JsBarcode(key, key);
  */
  toBardCode(){
    for(let key of this.codigos_productos){
      let canvas = document.getElementById(key);
      JsBarcode(canvas, key);
    }
  }

  async getInventario(){
    return new Promise( resolve => {
      this.firebase.getInventario().then(
        snapshot => {
          if(snapshot.exists()){
            let values = snapshot.val();
            for(let key in values){
              let value = values[key];
              this.productos.push(value);
              this.codigos_productos.push(key);
            }
            this.ultima_pagina = Math.ceil(this.productos.length / this.productos_por_pagina);
            this.actualizarPaginaActual();
          }
        }
      ).catch( err => {
        console.error(err);
      })
      setTimeout(resolve, 1000);
    })
  }
  actualizarPaginaActual(){
    console.log(this.router.url.split('/'));
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
