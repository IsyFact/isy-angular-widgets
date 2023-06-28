import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ObjektSuchenComponent} from './pages/objekt-suchen/objekt-suchen.component';
import {ObjektAnzeigenComponent} from './pages/objekt-anzeigen/objekt-anzeigen.component';

const routes: Routes = [
  {
    path: 'objekt-suchen',
    component: ObjektSuchenComponent
  },
  {
    path: 'objekt-anzeigen/:id',
    component: ObjektAnzeigenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BedienkonzeptRoutingModule { }
