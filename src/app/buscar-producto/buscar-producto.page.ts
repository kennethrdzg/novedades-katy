import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Producto } from '../producto';
import { CrearPDFService } from '../crear-pdf.service';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.page.html',
  styleUrls: ['./buscar-producto.page.scss'],
})
export class BuscarProductoPage implements OnInit {
  id: string = '';
  last_id: string = '';
  error_status: boolean = false; 
  no_existe: boolean = false;

  producto: Producto = {nombre: '', precio: 0, descripcion: ''};
  constructor(private firebase: FirebaseService, 
    protected router: Router, private pdf: CrearPDFService) { }

  ngOnInit() {
  }

  buscarProductoPorId(){
    this.no_existe = false; 
    this.error_status = false; 
    this.firebase.buscarProductoPorId(this.id).then(
      respuesta => {
        if(respuesta.exists()){
          this.producto = respuesta.val();
          this.last_id = this.id;
        }
        else{
          this.no_existe = true;
          this.producto.nombre = '';
          this.last_id = '';
        }
      }
    ).catch( err => {
      console.error(err);
      this.error_status = true;
      this.producto.nombre = '';
      this.last_id = '';
    });
  }

  regresar(){
    this.producto.nombre = '';
    this.error_status = false; 
    this.no_existe = false; 
    this.id = '';
    this.router.navigate(['inventario'])
  }

  crearCodigoDeBarras(){
    this.pdf.crearCodigoDeBarras(this.last_id, this.producto)
  }

}
