import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjektSuchenComponent} from './objekt-suchen.component';
import {PersoenlicheInformationenComponent} from './components/persoenliche-informationen/persoenliche-informationen.component';
import {ResultListComponent} from './components/result-list/result-list.component';
import {DateService} from './services/date.service';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {WizardModule} from '../../../../../isy-angular-widgets/src/lib/wizard/wizard.module';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {ObjektSuchenRoutingModule} from './objekt-suchen-routing.module';
import {InputCharModule} from '../../../../../isy-angular-widgets/src/lib/input-char/input-char.module';

@NgModule({
  declarations: [ObjektSuchenComponent, PersoenlicheInformationenComponent, ResultListComponent],
  imports: [
    CommonModule,
    ObjektSuchenRoutingModule,
    CalendarModule,
    ToastModule,
    DialogModule,
    PanelModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
    InputTextModule,
    ReactiveFormsModule,
    WizardModule,
    TableModule,
    MultiSelectModule,
    InputCharModule
  ],
  providers: [DateService]
})
export class ObjektSuchenModule {}
