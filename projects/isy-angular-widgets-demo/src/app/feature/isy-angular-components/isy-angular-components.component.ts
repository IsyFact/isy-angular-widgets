import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
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
    InputGroupModule
  ]
})
export class IsyAngularComponentsComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly fb = inject(FormBuilder);

  personalInfoForm: FormGroup;
  person = initializedPerson;
  personalien = this.person.personalien;
  transferDateAsIso8601 = true;
  checked = false;

  constructor() {
    this.personalInfoForm = this.fb.group({
      firstName: [this.personalien.vorname, Validators.required],
      lastName: [this.personalien.nachname, Validators.required],
      dateOfEntry: [this.personalien.einreisedatum]
    });
  }

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`
    );
  }

  onTransferIso8601Change(incompleteDateComponent: IncompleteDateComponent): void {
    setTimeout(() => {
      incompleteDateComponent.updateModel();
      this.personalInfoForm.controls.dateOfEntry.updateValueAndValidity();
    });
  }
}
