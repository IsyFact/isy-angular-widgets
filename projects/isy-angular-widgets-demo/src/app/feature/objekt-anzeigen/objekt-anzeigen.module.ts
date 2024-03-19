import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {DialogSachverhalteBearbeitenComponent} from './components/dialog-sachverhalte-bearbeiten/dialog-sachverhalte-bearbeiten.component';
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
import {IncompleteDateModule} from '@isy-angular-widgets/incomplete-date/incomplete-date.module';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import {ObjektAnzeigenRoutingModule} from './objekt-anzeigen-routing.module';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputCharModule} from '@isy-angular-widgets/input-char/input-char.module';
import {SecurityModule} from '@isy-angular-widgets/security/security.module';
import {FileUploadModule} from 'primeng/fileupload';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {DividerModule} from 'primeng/divider';

@NgModule({
  declarations: [ObjektAnzeigenComponent, DialogSachverhalteBearbeitenComponent],
  providers: [],
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
    InputCharModule,
    SecurityModule,
    FileUploadModule,
    FormWrapperComponent,
    FormControlPipe,
    DividerModule
  ]
})
export class ObjektAnzeigenModule {}
