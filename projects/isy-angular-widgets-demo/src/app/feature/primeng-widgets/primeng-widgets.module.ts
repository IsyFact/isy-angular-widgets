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
import {KnobModule} from 'primeng/knob';
import {KeyFilterModule} from 'primeng/keyfilter';
import {PasswordModule} from 'primeng/password';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {SliderModule} from 'primeng/slider';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ChipsModule} from 'primeng/chips';

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
    InputTextareaModule,
    KnobModule,
    KeyFilterModule,
    PasswordModule,
    RadioButtonModule,
    RatingModule,
    SliderModule,
    TriStateCheckboxModule,
    ToggleButtonModule,
    ChipsModule
  ]
})
export class PrimengWidgetsModule {}
