import { Injectable } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class CrearPDFService {

  constructor() { }

  crearCodigoDeBarras(codigo: string, producto: Producto){
    const barcodePDF = new jsPDF();
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, codigo);
    const data = canvas.toDataURL('image/png');
    barcodePDF.setFontSize(36);
    barcodePDF.text(producto.nombre, 10, 16);
    barcodePDF.text('Precio: $' + producto.precio.toString(), 10, 32);
    barcodePDF.addImage(data, 'PNG', 0, 40, 200, 100);
    barcodePDF.save('barcode'+codigo+'.pdf');
  }
}
