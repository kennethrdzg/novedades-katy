import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Producto } from '../producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-nuevo',
  templateUrl: './producto-nuevo.page.html',
  styleUrls: ['./producto-nuevo.page.scss'],
})
export class ProductoNuevoPage implements OnInit {
  productForm = this.fb.group({
    nombre: ['', Validators.required], 
    precio: [0, [Validators.required, Validators.min(1)]], 
    descripcion: [''], 
    unidades: [0, [Validators.required, Validators.min(0)]]
  })
  constructor(
    private firebase: FirebaseService, 
    private fb: FormBuilder, 
    protected router: Router
  ) { }

  ngOnInit() {
  }

  agregarProducto(){
    let nuevo_producto: Producto = {
      'nombre': this.nombre?.getRawValue(), 
      'precio': this.precio?.getRawValue(), 
      'descripcion': this.descripcion?.getRawValue(), 
      'unidades': this.unidades?.getRawValue()
    }
    this.firebase.cargarProductoNuevo(nuevo_producto).then(
      respuesta => {
        console.log(respuesta);
        this.router.navigate(['inventario']);
      }
    ).catch( err => {
      alert(err)
    });
  }
  get nombre(){
    return this.productForm.get('nombre');
  }
  get precio(){
    return this.productForm.get('precio');
  }
  get descripcion(){
    return this.productForm.get('descripcion');
  }
  get unidades(){
    return this.productForm.get('unidades');
  }
}
