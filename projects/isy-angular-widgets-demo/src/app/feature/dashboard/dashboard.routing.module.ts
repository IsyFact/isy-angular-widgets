import {NgModule} from '@angular/core';
import {RouterModule, provideRouter} from '@angular/router';
import {routes} from './routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes)]
})
export class DashboardRoutingModule {}
