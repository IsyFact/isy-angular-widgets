import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {HauptfensterModule, IncompleteDateModule, SeitentoolbarComponent} from '@isy-angular-widgets/public-api';
import {initializedPerson} from '../objekt-anzeigen/data';
import {InputCharDirective} from '@isy-angular-widgets/input-char/directives/input-char.directive';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';

@Component({
  selector: 'demo-isy-angular-components',
  standalone: true,
  templateUrl: './isy-angular-components.component.html',
  styleUrl: './isy-angular-components.component.scss',
  imports: [
    FormWrapperComponent,
    TranslateModule,
    FormControlPipe,
    ReactiveFormsModule,
    IncompleteDateModule,
    InputCharDirective,
    InputTextModule,
    SeitentoolbarComponent,
    ButtonModule,
    HauptfensterModule,
    PanelModule,
    MenuModule
  ]
})
export class IsyAngularComponentsComponent {
  personalInfoForm: FormGroup;
  person = initializedPerson;
  personalien = this.person.personalien;

  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      firstName: [this.personalien.vorname, Validators.required],
      lastName: [this.personalien.nachname, Validators.required],
      dateOfEntry: [this.personalien.einreisedatum]
    });
  }
}
