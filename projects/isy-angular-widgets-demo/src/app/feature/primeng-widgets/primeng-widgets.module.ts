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
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {DropdownModule} from 'primeng/dropdown';
import {ListboxModule} from 'primeng/listbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TreeSelectModule} from 'primeng/treeselect';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SpeedDialModule} from 'primeng/speeddial';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {PaginatorModule} from 'primeng/paginator';
import {ScrollerModule} from 'primeng/scroller';
import {TableModule} from 'primeng/table';
import {CurrencyPipe} from '@angular/common';
import {TimelineModule} from 'primeng/timeline';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';

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
    ChipsModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule,
    CascadeSelectModule,
    DropdownModule,
    ListboxModule,
    MultiSelectModule,
    SelectButtonModule,
    TreeSelectModule,
    ButtonModule,
    SplitButtonModule,
    SpeedDialModule,
    OrganizationChartModule,
    PaginatorModule,
    ScrollerModule,
    TableModule,
    CurrencyPipe,
    TimelineModule,
    TreeModule,
    TreeTableModule
  ]
})
export class PrimengWidgetsModule {}
