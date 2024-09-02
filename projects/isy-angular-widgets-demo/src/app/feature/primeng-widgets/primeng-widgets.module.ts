import {PrimengWidgetsRoutingModule} from './primeng-widgets-routing.module';
import {PrimengWidgetsComponent} from './primeng-widgets.component';
import {NgModule} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [PrimengWidgetsComponent],
  providers: [],
  imports: [
    PrimengWidgetsRoutingModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule
  ]
})
export class PrimengWidgetsModule {}
