import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjektAnzeigenComponent} from './objekt-anzeigen.component';
import {DialogSachverhalteBearbeitenComponent} from './components/dialog-sachverhalte-bearbeiten/dialog-sachverhalte-bearbeiten.component';
import {PanelModule} from 'primeng/panel';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {TabsModule} from 'primeng/tabs';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';
import {InputMaskModule} from 'primeng/inputmask';
import {ObjektAnzeigenRoutingModule} from './objekt-anzeigen-routing.module';
import {TextareaModule} from 'primeng/textarea';
import {SecurityDirective} from '@isy-angular-widgets/security/security-directive';
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
    TabsModule,
    InputSwitchModule,
    InputNumberModule,
    DialogModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    CheckboxModule,
    IncompleteDateComponent,
    InputMaskModule,
    DatePickerModule,
    ReactiveFormsModule,
    TextareaModule,
    SecurityDirective,
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
