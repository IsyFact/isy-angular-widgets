import {Component, Input} from '@angular/core';
import {Person} from '../../shared/model/person';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {required} from '../../shared/validation/validator';
import {PersonalInformation} from './model/forms';
import {Validation} from '../../../../../isy-angular-widgets/src/lib/validation/validation';
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

  @Input() person: Person = {
    id: '1',
    personalien: {
      geburtsdatum: '03.08.1980',
      geburtsname: ' Mustermann',
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
      identityDocument: ''
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
    this.personalInfoForm = this.fb.group({
      lastName: new FormControl(this.person.personalien.nachname, required),
      birthName: new FormControl(this.person.personalien.geburtsname),
      birthplace: new FormControl(this.person.personalien.geburtsort),
      firstName: new FormControl(this.person.personalien.vorname, required),
      gender: new FormControl(this.person.personalien.geschlecht),
      // Demo: Validator isInPast - If the given value is a valid date, it will be checked if the date is in the past
      birthDate: new FormControl(this.person.personalien.geburtsdatum, Validation.isInPast),
      nationality: new FormControl(this.person.personalien.staatsangehoerigkeit),
      phoneNumber: new FormControl(this.person.personalien.telefonnummer),
      dateOfEntry: new FormControl(this.person.personalien.einreisedatum),
      idRequired: new FormControl(this.person.personalien.ausweispflichtig),
      securityLevel: new FormControl(this.person.personalien.sicherheitsstufe),
      intelligenceNotes: new FormControl(
        this.person.personalien.geheimdienstnotizen,
        Validators.maxLength(this.intelligenceNotesMaxLength)
      ),
      // Demo: Validator validUnspecifiedDate - Checks that the date is a valid unspecified date or valid date in german format DD.MM.YYYY
      dateOfDeparture: new FormControl(this.person.personalien.abreisedatum, Validation.validUnspecifiedDate),
      // Demo: Validator isInFuture - If the specified value is a valid date, it will be checked if the date is in the future
      passportExpirationDate: new FormControl(this.person.personalien.ablaufdatumReisepass, Validation.isInFuture),
      // Demo: Validator validCreditCardNumber - Checks the entry to see if it is a valid credit card number
      creditCardNumber: new FormControl(this.person.personalien.kreditkartennummer, Validation.validCreditCardNumber),
      // Demo: Validator dateFormat - Checks that the date is a valid date
      creditCardExpirationDate: new FormControl(
        this.person.personalien.ablaufdatumKreditkarte,
        Validation.dateFormat('DD.MM.YYYY', 'Ungültig', true)
      ),
      identityDocument: new FormControl('', required)
    });
    this.personalInfoForm.disable();
  }

  uploadFile(event: FileUploadHandlerEvent): void {
    this.personalInfoForm.get('identityDocument')?.setValue(event.files[0].name);
    this.personalInfoForm.get('identityDocument')?.enable();
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
}
