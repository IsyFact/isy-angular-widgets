import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {DialogSachverhalteBearbeitenComponent} from './components/dialog-sachverhalte-bearbeiten/dialog-sachverhalte-bearbeiten.component';
import {PanelModule} from 'primeng/panel';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {TabViewModule} from 'primeng/tabview';
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
import {ObjektAnzeigenRoutingModule} from './objekt-anzeigen-routing.module';
import {Textarea} from 'primeng/inputtextarea';
import {SecurityModule} from '@isy-angular-widgets/security/security.module';
import {FileUploadModule} from 'primeng/fileupload';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {DividerModule} from 'primeng/divider';
import {InputCharDirective} from '@isy-angular-widgets/input-char/directives/input-char.directive';
import {FieldsetModule} from 'primeng/fieldset';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {ToggleSwitchModule} from 'primeng/toggleswitch';

@NgModule({
  declarations: [ObjektAnzeigenComponent, DialogSachverhalteBearbeitenComponent],
  providers: [],
  imports: [
    CommonModule,
    ObjektAnzeigenRoutingModule,
    PanelModule,
    FormsModule,
    TranslateModule.forChild(),
    InputTextModule,
    TabViewModule,
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
    DatePickerModule,
    ReactiveFormsModule,
    Textarea,
    SecurityModule,
    FileUploadModule,
    FormWrapperComponent,
    FormControlPipe,
    DividerModule,
    InputCharDirective,
    FieldsetModule,
    SelectModule,
    ToggleSwitchModule
  ]
})
export class ObjektAnzeigenModule {}
