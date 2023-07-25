import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ObjektSuchenComponent} from './objekt-suchen.component';

const routes: Routes = [
  {
    path: '',
    component: ObjektSuchenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjektSuchenRoutingModule {
}
