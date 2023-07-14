import {Component, Input} from '@angular/core';
import {Person} from '../../../../shared/model/person';
import {ActivatedRoute} from '@angular/router';
import {PersonenService} from '../../services/personen.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

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

  personalInfoForm: FormGroup

  @Input() person: Person = {
    id: '1',
    personalData: {
      geburtsdatum: '03.08.1980',
      birthName: ' Mustermann',
      geburtsort: 'Köln',
      geschlecht: 'Männlich',
      nachname: 'Mustermann',
      staatsangehoerigkeit: 'Deutsch',
      vorname: 'Max',
      idRequired: true,
      phoneNumber: '',
      intelligenceNotes: '',
      securityLevel: 0,
      dateOfEntry: 'XX-XX-2000'
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
      lastName: new FormControl(this.person.personalData.nachname, Validators.required),
      birthName: new FormControl(this.person.personalData.birthName),
      birthplace: new FormControl(this.person.personalData.geburtsort),
      firstName: new FormControl(this.person.personalData.vorname, Validators.required),
      gender: new FormControl(this.person.personalData.geschlecht),
      birthDate: new FormControl(this.person.personalData.geburtsdatum),
      nationality: new FormControl(this.person.personalData.staatsangehoerigkeit),
      phoneNumber: new FormControl(this.person.personalData.phoneNumber),
      dateOfEntry: new FormControl(this.person.personalData.dateOfEntry),
      idRequired: new FormControl(this.person.personalData.idRequired),
      securityLevel: new FormControl(this.person.personalData.securityLevel),
      intelligenceNotes: new FormControl(this.person.personalData.intelligenceNotes, Validators.maxLength(this.intelligenceNotesMaxLength))
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
