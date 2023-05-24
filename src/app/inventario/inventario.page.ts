import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto';
import * as JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { CrearPDFService } from '../crear-pdf.service';

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
  math = Math
  admin: boolean = false;
  constructor(
    protected firebase: FirebaseService, 
    private route: ActivatedRoute, 
    protected router: Router, private pdf: CrearPDFService
    ) {
  }

  async ngOnInit() {
    await this.getInventario();
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
    this.pagina_actual = Number(this.route.snapshot.params['id']);
    if(Number.isNaN(this.pagina_actual) || this.pagina_actual > this.ultima_pagina || this.pagina_actual < 1){
      this.router.navigate(['404']);
    }
  }
  mostrarInventarioSiguiente(){
    this.pagina_actual ++;
    this.router.navigate(['/inventario', Math.min(this.pagina_actual, this.ultima_pagina)]);
  }
  mostrarInventarioAnterior(){
    this.pagina_actual --;
    this.router.navigate(['/inventario', Math.max(this.pagina_actual, 1)]);
  }

  crearCodigoDeBarras(idx: number){
    this.pdf.crearCodigoDeBarras(this.codigos_productos[idx], this.productos[idx]);
  }
}
