import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjektSuchenComponent} from './objekt-suchen.component';
import {PersoenlicheInformationenComponent} from './components/persoenliche-informationen/persoenliche-informationen.component';
import {ResultListComponent} from './components/result-list/result-list.component';
import {DateService} from './services/date.service';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {WizardModule} from '@isy-angular-widgets/wizard/wizard.module';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {ObjektSuchenRoutingModule} from './objekt-suchen-routing.module';
import {InputCharDirective} from '@isy-angular-widgets/input-char/directives/input-char.directive';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [ObjektSuchenComponent, PersoenlicheInformationenComponent, ResultListComponent],
  providers: [DateService],
  imports: [
    CommonModule,
    ObjektSuchenRoutingModule,
    DialogModule,
    PanelModule,
    FormsModule,
    TranslateModule.forChild(),
    InputTextModule,
    ReactiveFormsModule,
    WizardModule,
    TableModule,
    MultiSelectModule,
    InputCharDirective,
    FormWrapperComponent,
    FormControlPipe,
    DatePickerModule,
    SelectModule,
    ButtonModule
  ]
})
export class ObjektSuchenModule {}
