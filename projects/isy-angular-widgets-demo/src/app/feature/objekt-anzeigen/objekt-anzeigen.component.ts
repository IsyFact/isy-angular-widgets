import {Component, Input} from '@angular/core';
import {Address} from '../../shared/model/person';
import {TranslateService} from '@ngx-translate/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {required} from '../../shared/validation/validator';
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
    const addressGroup = addresses ? this.createNewAddressFomrGroup(addresses[0]) : this.createNewAddressFomrGroup();

    this.personalInfoForm = this.fb.group({
      lastName: new FormControl(personalien.nachname, required),
      birthName: new FormControl(personalien.geburtsname),
      birthplace: new FormControl(personalien.geburtsort),
      firstName: new FormControl(personalien.vorname, required),
      gender: new FormControl(personalien.geschlecht),
      // Demo: Validator isInPast - If the given value is a valid date, it will be checked if the date is in the past
      birthDate: new FormControl(personalien.geburtsdatum, Validation.isInPast),
      nationality: new FormControl(personalien.staatsangehoerigkeit),
      phoneNumber: new FormControl(personalien.telefonnummer),
      dateOfEntry: new FormControl(personalien.einreisedatum),
      idRequired: new FormControl(personalien.ausweispflichtig),
      securityLevel: new FormControl(personalien.sicherheitsstufe),
      intelligenceNotes: new FormControl(
        personalien.geheimdienstnotizen,
        Validators.maxLength(this.intelligenceNotesMaxLength)
      ),
      // Demo: Validator validUnspecifiedDate - Checks that the date is a valid unspecified date or valid date in german format DD.MM.YYYY
      dateOfDeparture: new FormControl(personalien.abreisedatum, Validation.validUnspecifiedDate),
      // Demo: Validator isInFuture - If the specified value is a valid date, it will be checked if the date is in the future
      passportExpirationDate: new FormControl(personalien.ablaufdatumReisepass, Validation.isInFuture),
      // Demo: Validator validCreditCardNumber - Checks the entry to see if it is a valid credit card number
      creditCardNumber: new FormControl(personalien.kreditkartennummer, Validation.validCreditCardNumber),
      // Demo: Validator dateFormat - Checks that the date is a valid date in ISO8601
      creditCardExpirationDate: new FormControl(personalien.ablaufdatumKreditkarte, Validation.isoDate),
      identityDocument: new FormControl(personalien.identityDocument, required),
      addresses: this.fb.array([addressGroup])
    });
    this.personalInfoForm.disable();

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
    this.personalInfoForm.disable();
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
    // ToDo: Check if address already added and invalid - if yes -> don't add a new address
    const newAddress = this.createNewAddressFomrGroup();
    markFormAsDirty(newAddress);

    const addresses = this.getAddresses();
    addresses.push(newAddress);
    // ToDo: Update the save functionality and unit tests ???
  }

  isAnyAddressAvailable(): boolean {
    return this.getAddresses().length > 1;
  }

  createNewAddressFomrGroup(value?: Address): FormGroup {
    return this.fb.group({
      streetName: new FormControl(value ? value.street : '', required),
      streetNumber: new FormControl(value ? value.number : '', required),
      zip: new FormControl(value ? value.zip : '', required),
      city: new FormControl(value ? value.city : '', required),
      country: new FormControl(value ? value.country : '', required)
    });
  }

  disableDeleteButton(): boolean {
    return this.getAddresses().length === 1;
  }

  removeAddress(index: number): void {
    const addresses = this.getAddresses();
    addresses.removeAt(index);
    // ToDo: Must be the form validity updated ???
  }

  onEdit(): void {
    // ToDo: on edit functionalitty + if error stop action OR delete address with error ???
    this.personalInfoForm.enable();
  }

  onCancel(): void {
    this.personalInfoForm.disable();
    const addresses = this.getAddresses();
    const availableAddresses = addresses.length - 1;
    // ToDo: Check valid state
  }

  getAddresses(): FormArray {
    return this.personalInfoForm.get('addresses') as FormArray;
  }
}
