import {PrimengWidgetsRoutingModule} from './primeng-widgets-routing.module';
import {PrimengWidgetsComponent} from './primeng-widgets.component';
import {NgModule} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';

@NgModule({
  declarations: [PrimengWidgetsComponent],
  providers: [],
  imports: [
    PrimengWidgetsRoutingModule,
    TabViewModule
  ]
})
export class PrimengWidgetsModule {}
