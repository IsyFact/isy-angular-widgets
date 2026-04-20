import {
  AfterContentChecked,
  afterNextRender,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  Input
} from '@angular/core';
import {Address} from '../../shared/model/person';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Validation} from '@isy-angular-widgets/validation/validation';
import {FileUploadHandlerEvent, FileUploadModule} from 'primeng/fileupload';
import {initializedPerson} from './data';
import {markFormAsDirty} from '../../shared/validation/form-helper';
import {TabsModule} from 'primeng/tabs';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {InputCharDirective} from '@isy-angular-widgets/input-char/public-api';
import {SelectModule} from 'primeng/select';
import {DatePickerModule} from 'primeng/datepicker';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';
import {InputMaskModule} from 'primeng/inputmask';
import {DividerModule} from 'primeng/divider';
import {FieldsetModule} from 'primeng/fieldset';
import {ButtonModule} from 'primeng/button';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {TableModule} from 'primeng/table';
import {DialogSachverhalteBearbeitenComponent} from './components/dialog-sachverhalte-bearbeiten/dialog-sachverhalte-bearbeiten.component';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {ChipModule} from 'primeng/chip';
import {MessageModule} from 'primeng/message';

/*
 * This page implements a suggestion for the Object Bearbeiten workflow.
 */
@Component({
  standalone: true,
  selector: 'demo-objekt-anzeigen',
  templateUrl: './objekt-anzeigen.component.html',
  styleUrls: ['./objekt-anzeigen.component.scss'],
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    TabsModule,
    FormWrapperComponent,
    TranslateModule,
    FormControlPipe,
    InputCharDirective,
    SelectModule,
    DatePickerModule,
    IncompleteDateComponent,
    InputMaskModule,
    FileUploadModule,
    DividerModule,
    FieldsetModule,
    ButtonModule,
    ToggleSwitchModule,
    CheckboxModule,
    InputNumberModule,
    TableModule,
    DialogSachverhalteBearbeitenComponent,
    ToastModule,
    TextareaModule,
    ChipModule,
    MessageModule
  ]
})
export class ObjektAnzeigenComponent implements AfterContentChecked {
  readonly intelligenceNotesMaxLength = 255;
  readonly maxNationalities = 5;
  readonly nationalityInputMaxLength = 64;

  showSecretFields = false;

  personalInfoForm: FormGroup;

  addressFormControlNames: string[] = [];

  adressFormArray?: FormArray;

  private lastTrigger?: HTMLElement;
  private readonly injector = inject(Injector);

  isDialogVisible = false;

  openDialog(event: Event): void {
    if (event.currentTarget instanceof HTMLElement) {
      this.lastTrigger = event.currentTarget;
    }

    this.isDialogVisible = true;
  }

  onDialogVisibleChange(visible: boolean): void {
    this.isDialogVisible = visible;

    if (!visible) {
      this.restoreFocus();
    }
  }

  private restoreFocus(): void {
    const target = this.lastTrigger;

    if (!target?.isConnected) {
      return;
    }

    afterNextRender(
      {
        write: () => target.focus()
      },
      {injector: this.injector}
    );
  }

  @Input() person = initializedPerson;

  translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  constructor() {
    const personalien = this.person.personalien;
    const addresses = personalien.addresses;
    const addressGroup = addresses ? this.createNewAddressFormGroup(addresses[0]) : this.createNewAddressFormGroup();

    this.personalInfoForm = this.fb.group({
      lastName: [personalien.nachname, Validators.required],
      // Demo: Validator validateDIN91379 - Checks that the form field is valid according to DIN 91379
      birthName: [personalien.geburtsname, Validation.validateDIN91379('A')],
      birthplace: [personalien.geburtsort],
      firstName: [personalien.vorname, Validators.required],
      gender: [personalien.gender],
      // Demo: Validator isInPast - If the given value is a valid date, it will be checked if the date is in the past
      birthDate: [personalien.geburtsdatum, Validation.isInPast],
      nationalityInput: [''],
      nationalities: this.createNationalitiesFormArray(personalien.staatsangehoerigkeit),
      phoneNumber: [personalien.telefonnummer],
      dateOfEntry: [personalien.einreisedatum],
      idRequired: [personalien.ausweispflichtig],
      securityLevel: [personalien.sicherheitsstufe],
      intelligenceNotes: [personalien.geheimdienstnotizen, Validators.maxLength(this.intelligenceNotesMaxLength)],
      // Demo: Validator validUnspecifiedDate - Checks that the date is a valid unspecified date or valid date in german format DD.MM.YYYY
      dateOfDeparture: [personalien.abreisedatum, Validation.validUnspecifiedDate],
      // Demo: Validator dateFormat - Checks that the date is a valid date in ISO8601
      identityCardExpirationDate: [personalien.ablaufdatumPersonalausweis, Validation.isoDate],
      // Demo: Validator isInFuture - If the specified value is a valid date, it will be checked if the date is in the future
      passportExpirationDate: [personalien.ablaufdatumReisepass, Validation.isInFuture],
      // Demo: Validator validCreditCardNumber - Checks the entry to see if it is a valid credit card number
      creditCardNumber: [personalien.kreditkartennummer, Validation.validCreditCardNumber],
      creditCardExpirationDate: [personalien.ablaufdatumKreditkarte, Validation.validCreditCardExpirationDate],
      identityDocument: [personalien.identityDocument],
      addresses: this.fb.array([addressGroup])
    });

    // Exports the addresses form array for the iteration inside the template
    this.adressFormArray = this.getAddresses();
    // Exports the form control names of the addresses form array
    this.addressFormControlNames = Object.keys(this.getAddresses().controls[0].value as string[]);
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  uploadFile(event: FileUploadHandlerEvent): void {
    const identityDocument = this.personalInfoForm.get('identityDocument');
    identityDocument?.setValue(event.files[0].name);
    identityDocument?.enable();
    this.personalInfoForm.updateValueAndValidity();
  }

  savePersonalien(): void {
    this.personalInfoForm.clearValidators();
    const formValue = this.personalInfoForm.getRawValue();

    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('isyAngularWidgetsDemo.messages.savePersonSummary') as string,
      detail: this.translate.instant('isyAngularWidgetsDemo.messages.savePersonDetail', {
        firstName: formValue.firstName,
        lastName: formValue.lastName
      }) as string
    });
  }

  private minArrayLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const length = Array.isArray(value) ? value.length : 0;

      return length < min
        ? {
            minlength: {
              requiredLength: min,
              actualLength: length
            }
          }
        : null;
    };
  }

  private maxArrayLength(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const length = Array.isArray(value) ? value.length : 0;

      return length > max
        ? {
            maxlength: {
              requiredLength: max,
              actualLength: length
            }
          }
        : null;
    };
  }

  private createNationalitiesFormArray(initialNationality?: string): FormArray {
    const initialValues = initialNationality?.trim() ? [initialNationality.trim()] : [];

    return this.fb.array(
      initialValues.map((value) => this.fb.nonNullable.control(value)),
      [this.minArrayLength(1), this.maxArrayLength(this.maxNationalities)]
    );
  }

  getNationalities(): FormArray {
    return this.personalInfoForm.get('nationalities') as FormArray;
  }

  private getNationalityInputValue(): string {
    return String(this.personalInfoForm.get('nationalityInput')?.value ?? '').trim();
  }

  addNationality(): void {
    if (this.personalInfoForm.disabled) {
      return;
    }

    const value = this.getNationalityInputValue();
    const nationalities = this.getNationalities();

    nationalities.markAsTouched();

    if (!value || nationalities.length >= this.maxNationalities) {
      nationalities.updateValueAndValidity();
      return;
    }

    nationalities.push(this.fb.nonNullable.control(value));
    nationalities.markAsDirty();
    nationalities.markAsTouched();
    nationalities.updateValueAndValidity();

    this.personalInfoForm.get('nationalityInput')?.setValue('');
  }

  removeNationality(index: number): void {
    const nationalities = this.getNationalities();

    if (index < 0 || index >= nationalities.length || nationalities.length <= 1) {
      return;
    }

    nationalities.removeAt(index);
    nationalities.markAsDirty();
    nationalities.markAsTouched();
    nationalities.updateValueAndValidity();
  }

  disableAddNationality(): boolean {
    return (
      this.personalInfoForm.disabled ||
      !this.getNationalityInputValue() ||
      this.getNationalities().length >= this.maxNationalities
    );
  }

  disableRemoveNationality(): boolean {
    return this.personalInfoForm.disabled || this.getNationalities().length <= 1;
  }

  showNationalitiesError(errorKey: 'minlength' | 'maxlength'): boolean {
    const nationalities = this.getNationalities();
    return nationalities.hasError(errorKey) && (nationalities.touched || nationalities.dirty);
  }

  getNationalitiesDescribedBy(): string {
    const ids = ['nationalities-help'];

    if (this.showNationalitiesError('minlength')) {
      ids.push('nationalities-error-required');
    }

    if (this.showNationalitiesError('maxlength')) {
      ids.push('nationalities-error-max');
    }

    return ids.join(' ');
  }

  onNationalityInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addNationality();
    }
  }

  addNewAddress(): void {
    const newAddress = this.createNewAddressFormGroup();
    markFormAsDirty(newAddress);

    const addresses = this.getAddresses();
    addresses.push(newAddress);
  }

  isAnyAddressAvailable(): boolean {
    return this.getAddresses().length > 1;
  }

  createNewAddressFormGroup(value?: Address): FormGroup {
    return this.fb.group({
      streetName: [value?.street ?? ''],
      streetNumber: [value?.number ?? ''],
      zip: [value?.zip ?? ''],
      city: [value?.city ?? ''],
      country: [value?.country ?? '']
    });
  }

  disableDeleteButton(): boolean {
    return this.getAddresses().length === 1;
  }

  removeAddress(index: number): void {
    const addresses = this.getAddresses();

    if (index >= 0 && addresses.length > 1) {
      addresses.removeAt(index);
    }
  }

  getAddresses(): FormArray {
    return this.personalInfoForm.get('addresses') as FormArray;
  }
}
