import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioPage } from './inventario.page';

const routes: Routes = [
  {
    path: ':id', 
    component: InventarioPage,
  },
  {
    path: '',
    redirectTo: '1', 
    pathMatch: 'full'
  }, 
  {
    path: '**', 
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioPageRoutingModule {}
