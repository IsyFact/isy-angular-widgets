import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BedienkonzeptRoutingModule} from './bedienkonzept-routing.module';
import {ResultListComponent} from './components/result-list/result-list.component';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {ObjektSuchenComponent} from './pages/objekt-suchen/objekt-suchen.component';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {ObjektAnzeigenComponent} from './pages/objekt-anzeigen/objekt-anzeigen.component';
import {TabViewModule} from 'primeng/tabview';
import {SharedModule} from '../../shared/shared.module';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputMaskModule} from 'primeng/inputmask';
import {FieldsetModule} from 'primeng/fieldset';
import {DialogModule} from 'primeng/dialog';
import {IncompleteDateModule} from '../../../../../isy-angular-widgets/src/lib/incomplete-date/incomplete-date.module';
import {PersoenlicheInformationenComponent} from './components/persoenliche-informationen/persoenliche-informationen.component';
import {MessagesModule} from 'primeng/messages';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {WizardModule} from '../../../../../isy-angular-widgets/src/lib/wizard/wizard.module';
import {PanelModule} from 'primeng/panel';
import {NotificationService} from '../../shared/services/notification.service';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputCharModule} from "../../../../../isy-angular-widgets/src/lib/input-char/input-char.module";
import {HttpClientModule} from "@angular/common/http";
import {TranslateModule} from "@ngx-translate/core";
import {MessageModule} from "primeng/message";


@NgModule({
  declarations: [
    ResultListComponent,
    ObjektSuchenComponent,
    ObjektAnzeigenComponent,
    PersoenlicheInformationenComponent
  ],
  exports: [
    ResultListComponent,
    PersoenlicheInformationenComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BedienkonzeptRoutingModule,
    MultiSelectModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    InputTextareaModule,
    InputNumberModule,
    CheckboxModule,
    InputSwitchModule,
    InputMaskModule,
    FieldsetModule,
    DialogModule,
    IncompleteDateModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    RippleModule,
    ToastModule,
    WizardModule,
    PanelModule,
    ProgressSpinnerModule,
    InputCharModule,
    HttpClientModule,
    TranslateModule,
    MessageModule
  ],
  providers: [
    NotificationService
  ]
})
export class BedienkonzeptModule {
}
