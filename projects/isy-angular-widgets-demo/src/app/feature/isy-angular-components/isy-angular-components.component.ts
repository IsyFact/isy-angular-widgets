import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';
import {SeitentoolbarComponent} from '@isy-angular-widgets/seitentoolbar/seitentoolbar.component';
import {initializedPerson} from '../objekt-anzeigen/data';
import {InputCharDirective} from '@isy-angular-widgets/input-char/directives/input-char.directive';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputGroupModule} from 'primeng/inputgroup';
import {AnchorNavigationService} from '../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../shared/components/section-heading/section-heading.component';

@Component({
  standalone: true,
  selector: 'demo-isy-angular-components',
  templateUrl: './isy-angular-components.component.html',
  imports: [
    FormsModule,
    FormWrapperComponent,
    TranslateModule,
    FormControlPipe,
    ReactiveFormsModule,
    IncompleteDateComponent,
    InputCharDirective,
    InputTextModule,
    SeitentoolbarComponent,
    ButtonModule,
    CheckboxModule,
    InputGroupModule,
    SectionHeadingComponent
  ]
})
export class IsyAngularComponentsComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  private readonly fb = inject(FormBuilder);

  personalInfoForm: FormGroup;
  person = initializedPerson;
  personalien = this.person.personalien;
  transferDateAsIso8601 = true;
  outlineInputChar = false;
  checked = false;

  constructor() {
    this.personalInfoForm = this.fb.group({
      firstName: [this.personalien.vorname, Validators.required],
      lastName: [this.personalien.nachname, Validators.required],
      dateOfEntry: [this.personalien.einreisedatum]
    });
  }

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }
  onTransferIso8601Change(incompleteDateComponent: IncompleteDateComponent): void {
    setTimeout(() => {
      incompleteDateComponent.updateModel();
      this.personalInfoForm.controls.dateOfEntry.updateValueAndValidity();
    });
  }
}
