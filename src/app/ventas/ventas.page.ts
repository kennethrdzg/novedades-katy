import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { TicketProducto } from '../ticket-producto';
import { Producto } from '../producto';
import {jsPDF} from 'jspdf'
import * as JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  ticket_productos: TicketProducto[] = [];

  producto_inexistente: boolean = false;

  sub_total: number = 0;

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
          this.actualizarSubtotal();
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
    });
    this.actualizarSubtotal();
  }

  async realizarVenta(){
    this.actualizarSubtotal();
    let fecha = Date();
    let ingreso = 0;
    for(let producto of this.ticket_productos){
      ingreso = ingreso + producto.precio * producto.unidades;
    }
    this.firebase.crearTicket(fecha, ingreso)?.then(
      async respuesta => {
        let id_ticket = respuesta.key;
        if(id_ticket == null){
          console.error("Could not get ticket ID, aborting");
        }
        else{
          //let canvas = (<HTMLCanvasElement>document.getElementById('ticket-canvas')); 
          let canvas = document.createElement('canvas');
          JsBarcode(canvas, id_ticket);
          const ticketPDF = new jsPDF(
            'portrait', 'mm', [this.ticket_productos.length * 20 + 120, 200]
          );
          ticketPDF.text('Novedades Katy', 50, 30);
          //ticketPDF.text('Artículo', 10, 20);
          ticketPDF.text('Precio    Unidades', 60, 50);
          ticketPDF.text('Importe', 110, 50);
          let count = 0
          for(let ticket_producto of this.ticket_productos){
            const result = await this.cargarTicketProducto(id_ticket, ticketPDF, ticket_producto, count, 20, 60);
            count += 1
          }
          ticketPDF.text('--------------------------------------------------------------------', 5, 50 + count * 20);
          ticketPDF.text('Total:    $' + ingreso, 90, 55 + count * 20);
          if(canvas!=null){
            const data = canvas.toDataURL('image/png');
            console.log(data);  
            ticketPDF.text('Fecha: ' + fecha.substring(0, 34), 5, 65 + count * 20);
            ticketPDF.addImage(data, 'PNG', 30, 75 + count * 20, 80, 40);
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

  actualizarSubtotal(){
    this.sub_total = 0;
    for(let producto of this.ticket_productos){
      this.sub_total += producto.precio * producto.unidades;
    }
  }

  /*cargarTicketProducto = (producto: TicketProducto, ticketPDF) => {
    new Promise( resolve => {
      let buffet = 20; 
      let count = 0;
    })
  }*/

  async cargarTicketProducto(id_ticket: string, ticketPDF: jsPDF, ticket_producto: TicketProducto, count: number, buffer: number, start: number){
    let result = 'None'
    return new Promise( resolve => {
      ticket_producto.id_ticket = id_ticket
      this.firebase.cargarTicketProducto(ticket_producto)?.then(
        respuesta => {
          if(respuesta.key != null){
            result = respuesta.key;
          }
          ticketPDF.text(ticket_producto.nombre.toString(), 5, start + count * buffer); 
          ticketPDF.text('$' + ticket_producto.precio.toString(), 60, start + count * buffer);
          ticketPDF.text(ticket_producto.unidades.toString(), 90, start + count * buffer);
          ticketPDF.text('$' + (ticket_producto.unidades * ticket_producto.precio).toString(), 110, start + count * buffer);
          //ticketPDF.text(ticket_producto.unidades.toString() + ' x $' + ticket_producto.precio.toString(), 100, start + count * buffer);
        }
      ).catch(err => {
        console.error(err);
      })
      setTimeout( () => resolve(result), 1000);
    })
  }
}
