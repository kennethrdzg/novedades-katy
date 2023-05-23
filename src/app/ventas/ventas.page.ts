import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  productos: Producto[] = []

  productoForm = this.fb.group({
    codigo: ['', [Validators.required]]
  })
  constructor(private firebase: FirebaseService, 
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  agregarProducto(){
    console.log(this.codigo?.getRawValue());
    this.firebase.getProductoPorCodigo( this.codigo?.getRawValue() ).subscribe(
      response => {
        let producto: any = response;
        this.productos.push(producto);
      }
    )
  }
  get codigo(){
    return this.productoForm.get('codigo');
  }
}
