import {Component, Input} from '@angular/core';
import {Person} from '../../../../shared/model/person';
import {ActivatedRoute} from '@angular/router';
import {PersonenService} from '../../services/personen.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';

/*
* This page implements a suggestion for the Object Bearbeiten workflow.
 */
@Component({
  selector: 'demo-objekt-bearbeiten-draft',
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
      einreisedatum: 'XX-XX-2000'
    },
    liste: [
      'Hat einen Antrag auf BAFÖG gestellt',
      'Wurde wegen Falschparkens ermahnt',
      'Steht auf der NO-FLY-Liste'
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private personService: PersonenService,
    public translate: TranslateService,
    private  fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.personalInfoForm = this.fb.group({
      lastName: new FormControl(this.person.personalien.nachname, Validators.required),
      birthName: new FormControl(this.person.personalien.geburtsname),
      birthplace: new FormControl(this.person.personalien.geburtsort),
      firstName: new FormControl(this.person.personalien.vorname, Validators.required),
      gender: new FormControl(this.person.personalien.geschlecht),
      birthDate: new FormControl(this.person.personalien.geburtsdatum),
      nationality: new FormControl(this.person.personalien.staatsangehoerigkeit),
      phoneNumber: new FormControl(this.person.personalien.telefonnummer),
      dateOfEntry: new FormControl(this.person.personalien.einreisedatum),
      idRequired: new FormControl(this.person.personalien.ausweispflichtig),
      securityLevel: new FormControl(this.person.personalien.sicherheitsstufe),
      intelligenceNotes: new FormControl(this.person.personalien.geheimdienstnotizen, Validators.maxLength(this.intelligenceNotesMaxLength))
    });
    this.personalInfoForm.disable()
  }

  savePersonalien(): void {
    this.personalInfoForm.disable();
    this.personalInfoForm.clearValidators();
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('isyAngularWidgetsDemo.messages.savePersonSummary'),
      detail: this.translate.instant('isyAngularWidgetsDemo.messages.savePersonDetail', {
        firstName: this.personalInfoForm.value.firstName,
        lastName: this.personalInfoForm.value.lastName
      })
    });
  }
}
