import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Ticket } from '../ticket';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  constructor(
    private firebase: FirebaseService, 
    protected router: Router
  ) { }

  ngOnInit() {
  }

  reporteDiario(){
    let fecha = new Date(); 
    let tickets_de_hoy: string[] = [];
    this.firebase.getTickets().then(
      tickets => {
        let total = 0;
        if(tickets.exists()){
          const pdf = new jsPDF();
          pdf.text(fecha.getFullYear().toString()+'-'+(fecha.getMonth()+1).toString()+'-'+fecha.getDate().toString() + ' REPORTE DIARIO', 10, 10)
          for(let ticket_id in tickets.val()){
            let ticket: Ticket = tickets.val()[ticket_id];
            let f = new Date(ticket.fecha);
            if(f.getDate() == fecha.getDate() && f.getMonth() == fecha.getMonth() && f.getFullYear() == fecha.getFullYear()){
              let minutes: string = f.getMinutes().toString();
              if(f.getMinutes() < 10){
                minutes = '0' + minutes;
              }
              pdf.text(f.getHours().toString() + ':' + minutes + ' ' + ticket_id + " $" + ticket.ingreso.toString(), 10, 30 + 20 * tickets_de_hoy.length);
              total += ticket.ingreso; 
              tickets_de_hoy.push(ticket_id);
            }
          }
          pdf.text("Total: $" + total.toString(), 10, 30 + 20 * tickets_de_hoy.length);
          console.log("Tickets de hoy: ");
          console.log(tickets_de_hoy);
          pdf.save('reporte-'+fecha.getTime()+'.pdf')
        }
        else{
          console.log("No existe");
        }
      }
    ).catch(
      err => {
        alert(err);
      }
    )
  }
  reporteSemanal(){
    let fecha = new Date(); 
    let tickets_semana: string[] = [];
    this.firebase.getTickets().then(
      tickets => {
        let total = 0;
        if(tickets.exists()){
          const pdf = new jsPDF();
          pdf.text(fecha.getFullYear().toString()+'-'+(fecha.getMonth()+1).toString()+'-'+fecha.getDate().toString() + ' REPORTE SEMANAL', 10, 10)
          for(let ticket_id in tickets.val()){
            let ticket: Ticket = tickets.val()[ticket_id];
            let f = new Date(ticket.fecha);
            if(this.semanaValida(fecha, f)){
              let dia = f.getDate().toString();
              if(f.getDate() < 10){
                dia = '0' + dia;
              }
              let mes = (f.getMonth()+ 1).toString();
              if(f.getMonth() + 1 < 10){
                mes = '0' + mes;
              }
              pdf.text(dia + '-' + mes + '-' + f.getFullYear().toString() + ' '+ ticket_id + " $" + ticket.ingreso.toString(), 10, 30 + 20 * tickets_semana.length);
              total += ticket.ingreso; 
              tickets_semana.push(ticket_id);
            }
          }
          pdf.text("Total: $" + total.toString(), 10, 30 + 20 * tickets_semana.length);
          pdf.save('reporte-'+fecha.getTime()+'.pdf')
        }
        else{
          console.log("No existe");
        }
      }
    ).catch(
      err => {
        alert(err);
      }
    )
  }

  semanaValida(hoy: Date, otra_fecha: Date){
    let dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; 
    if(hoy.getFullYear() % 4){
      dias[1] = 29;
    }
    console.log(dias);
    if(hoy.getFullYear() == otra_fecha.getFullYear() && hoy.getMonth() == otra_fecha.getMonth() && otra_fecha.getDate() >= hoy.getDate() - 6){
      return true;
    }
    let prev_m = hoy.getMonth() - 1; 
    if(prev_m < 0){
      prev_m = 11;
    }
    if(hoy.getFullYear() == otra_fecha.getFullYear() && otra_fecha.getMonth() == hoy.getMonth() - 1 && otra_fecha.getDate() >= hoy.getDate() + dias[prev_m] - 6){
      return true;
    }
    if(hoy.getFullYear() == otra_fecha.getFullYear() + 1 && hoy.getMonth() == 0 && otra_fecha.getMonth() == 11 && otra_fecha.getDate() >= hoy.getDate() + 25){
      return true;
    }
    return false;
  }

  reporteMensual(){
    let fecha = new Date(); 
  }
}
