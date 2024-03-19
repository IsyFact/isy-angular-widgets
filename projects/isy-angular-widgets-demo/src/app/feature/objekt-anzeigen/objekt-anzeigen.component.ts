import {Component, Input} from '@angular/core';
import {Person} from '../../shared/model/person';
import {TranslateService} from '@ngx-translate/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {required} from '../../shared/validation/validator';
import {PersonalInformation} from './model/forms';
import {Validation} from '@isy-angular-widgets/validation/validation';
import {FileUploadHandlerEvent} from 'primeng/fileupload';

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

  @Input() person: Person = {
    id: '1',
    personalien: {
      geburtsdatum: '03.08.1980',
      geburtsname: 'Mustermann',
      geburtsort: 'Köln',
      geschlecht: 'Männlich',
      nachname: 'Mustermann',
      staatsangehoerigkeit: 'Deutsch',
      vorname: 'Max',
      ausweispflichtig: true,
      telefonnummer: '',
      geheimdienstnotizen: '',
      sicherheitsstufe: 0,
      einreisedatum: 'xx.xx.2000',
      abreisedatum: 'xx.xx.2024',
      ablaufdatumReisepass: '',
      kreditkartennummer: '',
      ablaufdatumKreditkarte: '',
      identityDocument: '',
      bilanz: 0,
      status: '',
      address: [
        {
          street: 'Frankfurterstr.',
          number: 6,
          zip: 12345,
          city: 'Köln',
          country: 'Deutschland'
        }
      ]
    },
    sachverhalte: [
      'Hat einen Antrag auf BAFÖG gestellt',
      'Wurde wegen Falschparkens ermahnt',
      'Steht auf der NO-FLY-Liste'
    ]
  };

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    const personalien = this.person.personalien;
    const addresses = personalien.address;

    const addressGroup = this.fb.group({
      streetName: new FormControl(addresses ? addresses[0].street : '', required),
      streetNumber: new FormControl(addresses ? addresses[0].number : '', required),
      zip: new FormControl(addresses ? addresses[0].zip : '', required),
      city: new FormControl(addresses ? addresses[0].city : '', required),
      country: new FormControl(addresses ? addresses[0].country : '', required)
    });

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
    this.adressFormArray = this.personalInfoForm.get('addresses') as FormArray;
    // Exports the form control names of the addresses form array
    this.addressFormControlNames = this.getAddressFormControlNames();
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

  getAddressFormControlNames(): string[] {
    const formControls = (this.personalInfoForm.get('addresses') as FormArray).controls[0].value as string[];
    return Object.keys(formControls);
  }

  duplicateAddressFields(): void {
    // ToDo: Add new address form fields to form (without conflict!)
    //       Hint: Replace form control with second form only for address???
  }

  removeAddressFields(): void {
    // ToDo: Detect the group of fields who must be removed and remove them from form
    //       Hint: UUID for form control name usage or anything else?
  }
}
