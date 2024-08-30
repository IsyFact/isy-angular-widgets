import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrimengWidgetsComponent} from './primeng-widgets.component';

const routes: Routes = [
  {
    path: '',
    component: PrimengWidgetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimengWidgetsRoutingModule {}
