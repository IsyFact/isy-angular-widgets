import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {
  DialogSachverhalteBearbeitenComponent
} from './components/dialog-sachverhalte-bearbeiten/dialog-sachverhalte-bearbeiten.component';
import {PanelModule} from 'primeng/panel';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {TabViewModule} from 'primeng/tabview';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';
import {IncompleteDateModule} from '../../../../../isy-angular-widgets/src/lib/incomplete-date/incomplete-date.module';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import {ObjektAnzeigenRoutingModule} from './objekt-anzeigen-routing.module';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputCharModule} from '../../../../../isy-angular-widgets/src/lib/input-char/input-char.module';
import {SecurityService} from '../../../../../isy-angular-widgets/src/lib/security/security-service';
import {SecurityDirective} from '../../../../../isy-angular-widgets/src/lib/security/security-directive';


@NgModule({
  declarations: [
    ObjektAnzeigenComponent,
    DialogSachverhalteBearbeitenComponent,
    SecurityDirective
  ],
  imports: [
    CommonModule,
    ObjektAnzeigenRoutingModule,
    PanelModule,
    FormsModule,
    TranslateModule,
    InputTextModule,
    TabViewModule,
    DropdownModule,
    InputSwitchModule,
    InputNumberModule,
    DialogModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    CheckboxModule,
    IncompleteDateModule,
    InputMaskModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextareaModule,
    InputCharModule
  ],
  providers: [
    SecurityService
  ]
})
export class ObjektAnzeigenModule { }
