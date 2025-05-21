import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';
import {SeitentoolbarComponent} from '@isy-angular-widgets/seitentoolbar/seitentoolbar.component';
import {initializedPerson} from '../objekt-anzeigen/data';
import {InputCharDirective} from '@isy-angular-widgets/input-char/directives/input-char.directive';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@Component({
  standalone: true,
  selector: 'demo-isy-angular-components',
  templateUrl: './isy-angular-components.component.html',
  imports: [
    FormWrapperComponent,
    TranslateModule,
    FormControlPipe,
    ReactiveFormsModule,
    IncompleteDateComponent,
    InputCharDirective,
    InputTextModule,
    SeitentoolbarComponent,
    ButtonModule
  ]
})
export class IsyAngularComponentsComponent {
  personalInfoForm: FormGroup;
  person = initializedPerson;
  personalien = this.person.personalien;

  constructor(private readonly fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      firstName: [this.personalien.vorname, Validators.required],
      lastName: [this.personalien.nachname, Validators.required],
      dateOfEntry: [this.personalien.einreisedatum]
    });
  }
}
