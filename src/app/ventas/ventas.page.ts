import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { TicketProducto } from '../ticket-producto';
import { Producto } from '../producto';
import {jsPDF} from 'jspdf'

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  ticket_productos: TicketProducto[] = [];

  producto_inexistente: boolean = false;

  productoForm = this.fb.group({
    id: ['', [Validators.required]]
  })

  constructor(private firebase: FirebaseService, 
    private fb: FormBuilder, protected router: Router) { }

  ngOnInit() {
  }

  agregarProducto(){
    this.firebase.getProductoPorId( this.id?.getRawValue() ).then(
      respuesta => {
        if(respuesta.exists()){
          
          let valor: Producto = respuesta.val();
          
          let ticket_producto: TicketProducto = {
            id_producto: this.id?.getRawValue(), 
            id_ticket: '', 
            precio: valor.precio, 
            unidades: 0, 
            nombre: valor.nombre
          }

          let index = this.productoEnCarrito(ticket_producto.id_producto);
          console.log("Index: " + index.toString());
          if(index < 0){
            ticket_producto.unidades = 1
            this.ticket_productos.push(ticket_producto);
          }
          else{
            this.ticket_productos[index].unidades += 1
          }
          this.producto_inexistente = false
        }
        else{
          this.producto_inexistente = true;
        }
        this.productoForm.reset();
      }
    ).catch( err => {
      console.error(err);
    })
  }

  productoEnCarrito(id_producto: string){
    return this.ticket_productos.findIndex( (value, index) => {
      return value.id_producto == id_producto;
    });
  }

  get id(){
    return this.productoForm.get('id');
  }

  quitarProducto(idx: number){
    this.ticket_productos = this.ticket_productos.filter( (value, index) => {
      return index != idx;
    })
  }

  realizarVenta(){
    let fecha = Date();
    let ingreso = 0;
    for(let producto of this.ticket_productos){
      ingreso = ingreso + producto.precio * producto.unidades;
    }
    this.firebase.crearTicket(fecha, ingreso)?.then(
      respuesta => {
        let id_ticket = respuesta.key;
        if(id_ticket == null){
          console.error("Could not get ticket ID, aborting");
        }
        else{
          const ticketPDF = new jsPDF();
          ticketPDF.text('Novedades Katy', 1, 1);
          for(let producto of this.ticket_productos){
            producto.id_ticket = id_ticket;
            this.firebase.cargarTicketProducto(producto)?.then(
              res => {
                console.log('Producto cargado al ticket con éxito');
              }
            ).catch(
              err => {
                console.error(err);
              }
            )
          }
          ticketPDF.save('ticket'+id_ticket+'.pdf');
        }
        this.ticket_productos = [];
      }
    ).catch(
      err => {
        console.error(err);
      }
    );
  }
}
