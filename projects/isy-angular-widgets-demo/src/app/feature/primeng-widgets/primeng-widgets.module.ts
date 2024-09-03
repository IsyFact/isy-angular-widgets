import {PrimengWidgetsRoutingModule} from './primeng-widgets-routing.module';
import {PrimengWidgetsComponent} from './primeng-widgets.component';
import {NgModule} from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {ColorPickerModule} from 'primeng/colorpicker';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputOtpModule} from 'primeng/inputotp';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [PrimengWidgetsComponent],
  providers: [],
  imports: [
    PrimengWidgetsRoutingModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule,
    ColorPickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputMaskModule,
    InputSwitchModule,
    InputNumberModule,
    InputOtpModule,
    InputTextModule,
    InputTextareaModule
  ]
})
export class PrimengWidgetsModule {}
