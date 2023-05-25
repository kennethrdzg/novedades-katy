import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Ticket } from '../ticket';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  constructor(
    private firebase: FirebaseService
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
          pdf.text(fecha.getFullYear().toString()+'-'+(fecha.getMonth()+1).toString()+'-'+fecha.getDate().toString(), 10, 10)
          for(let ticket_id in tickets.val()){
            let ticket: Ticket = tickets.val()[ticket_id];
            let f = new Date(ticket.fecha);
            if(f.getDate() == fecha.getDate() && f.getMonth() == fecha.getMonth() && f.getFullYear() == fecha.getFullYear()){
              pdf.text(ticket_id + " $" + ticket.ingreso.toString(), 10, 30 + 20 * tickets_de_hoy.length);
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
        console.error(err);
      }
    )
  }
  reporteSemanal(){
    let fecha = new Date(); 
  }
  reporteMensual(){
    let fecha = new Date(); 
  }
}
