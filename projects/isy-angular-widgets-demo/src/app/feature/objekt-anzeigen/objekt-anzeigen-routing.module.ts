import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';

const routes: Routes = [
  {
    path: '',
    component: ObjektAnzeigenComponent
  },
  {
    path: ':id',
    component: ObjektAnzeigenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjektAnzeigenRoutingModule {
}
