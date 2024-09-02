import {PrimengWidgetsRoutingModule} from './primeng-widgets-routing.module';
import {PrimengWidgetsComponent} from './primeng-widgets.component';
import {NgModule} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {ColorPickerModule} from 'primeng/colorpicker';

@NgModule({
  declarations: [PrimengWidgetsComponent],
  providers: [],
  imports: [
    PrimengWidgetsRoutingModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule,
    ColorPickerModule
  ]
})
export class PrimengWidgetsModule {}
