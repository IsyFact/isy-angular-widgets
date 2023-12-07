import {NgModule} from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';
import {routes} from './routes';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes)]
})
export class AppRoutingModule {}
