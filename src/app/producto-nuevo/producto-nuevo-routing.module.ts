import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoNuevoPage } from './producto-nuevo.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoNuevoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoNuevoPageRoutingModule {}
