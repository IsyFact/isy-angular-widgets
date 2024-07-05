import {Component, Input} from '@angular/core';
import {Address} from '../../shared/model/person';
import {TranslateService} from '@ngx-translate/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {PersonalInformation} from './model/forms';
import {Validation} from '@isy-angular-widgets/validation/validation';
import {FileUploadHandlerEvent} from 'primeng/fileupload';
import {initializedPerson} from './data';
import {markFormAsDirty} from '../../shared/validation/form-helper';

/*
 * This page implements a suggestion for the Object Bearbeiten workflow.
 */
@Component({
  selector: 'demo-objekt-anzeigen',
  templateUrl: './objekt-anzeigen.component.html',
  styleUrls: ['./objekt-anzeigen.component.scss']
})
export class ObjektAnzeigenComponent {
  readonly intelligenceNotesMaxLength = 255;

  showSecretFields = false;

  personalInfoForm: FormGroup;

  addressFormControlNames: string[] = [];

  adressFormArray?: FormArray;

  @Input() person = initializedPerson;

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    const personalien = this.person.personalien;
    const addresses = personalien.addresses;
    const addressGroup = addresses ? this.createNewAddressFormGroup(addresses[0]) : this.createNewAddressFormGroup();

    this.personalInfoForm = this.fb.group({
      lastName: [personalien.nachname, Validators.required],
      birthName: [personalien.geburtsname],
      birthplace: [personalien.geburtsort],
      firstName: [personalien.vorname, Validators.required],
      gender: [personalien.gender],
      // Demo: Validator isInPast - If the given value is a valid date, it will be checked if the date is in the past
      birthDate: [personalien.geburtsdatum, Validation.isInPast],
      nationality: [personalien.staatsangehoerigkeit],
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

  uploadFile(event: FileUploadHandlerEvent): void {
    const identityDocument = this.personalInfoForm.get('identityDocument');
    identityDocument?.setValue(event.files[0].name);
    identityDocument?.enable();
    this.personalInfoForm.updateValueAndValidity();
  }

  savePersonalien(): void {
    this.personalInfoForm.clearValidators();
    const person = this.personalInfoForm.value as PersonalInformation;
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('isyAngularWidgetsDemo.messages.savePersonSummary') as string,
      detail: this.translate.instant('isyAngularWidgetsDemo.messages.savePersonDetail', {
        firstName: person.firstName,
        lastName: person.lastName
      }) as string
    });
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
