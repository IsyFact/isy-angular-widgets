import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../../../shared/model/person';
import {ActivatedRoute} from '@angular/router';
import {PersonenService} from '../../services/personen.service';

/*
* This page implements a suggestion for the Object Bearbeiten workflow.
 */
@Component({
  selector: 'demo-objekt-bearbeiten-draft',
  templateUrl: './objekt-anzeigen.component.html',
  styleUrls: ['./objekt-anzeigen.component.scss']
})
export class ObjektAnzeigenComponent implements OnInit {

  editable = false;
  showSecretFields = false;
  showError = false;

  @Input() person: Person = {
    id: '1',
    personalien: {
      geburtsdatum: '15.9.2021',
      geburtsname: $localize`Erika Musterfrau`,
      geburtsort: $localize`Köln`,
      geschlecht: $localize`Divers`,
      nachname: $localize`Mustermann`,
      staatsangehoerigkeit: $localize`Deutsch`,
      vorname: 'Max',
      ausweispflichtig: true,
      telefonnummer: '',
      geheimdienstnotizen: '',
      sicherheitsstufe: 0,
      einreisedatum: 'XX-XX-XXXX'
    }, sachverhalte: {
      liste: [$localize`Hat einen Antrag auf BAFÖG gestellt`, $localize`Wurde wegen Falschparkens ermahnt`, $localize`Steht auf der NO-FLY-Liste`]
    }
  };

  newGeburtsdatum = '';
  newGeburtsname = '';
  newGeburtsort = '';
  newGeschlecht = '';
  newNachname = '';
  newStaatsangehoerigkeit = '';
  newVorname = '';
  newAusweispflichtig = true;
  newTelefonnummer = '';
  newGeheimdienstnotizen = '';
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  newSicherheitsstufe = 0;
  newEinreisedatum = '';

  constructor(private route: ActivatedRoute, private personService: PersonenService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.personService.findPersonById(id).subscribe(person => {
        const firstPerson = 0;
        this.person = person[firstPerson];
        this.loadPerson();
      });
    } else {
      this.loadPerson();
    }
  }

  loadPerson(): void {
    this.newGeburtsdatum = this.person.personalien.geburtsdatum;
    this.newGeburtsname = this.person.personalien.geburtsname;
    this.newGeburtsort = this.person.personalien.geburtsort;
    this.newGeschlecht = this.person.personalien.geschlecht;
    this.newNachname = this.person.personalien.nachname;
    this.newStaatsangehoerigkeit = this.person.personalien.staatsangehoerigkeit;
    this.newVorname = this.person.personalien.vorname;
    this.newAusweispflichtig = this.person.personalien.ausweispflichtig;
    this.newTelefonnummer = this.person.personalien.telefonnummer;
    this.newGeheimdienstnotizen = this.person.personalien.geheimdienstnotizen;
  }

  savePersonalien(): void {
    this.editable = false;
    this.person.personalien.geburtsdatum = this.newGeburtsdatum;
    this.person.personalien.geburtsname = this.newGeburtsname;
    this.person.personalien.geburtsort = this.newGeburtsort;
    this.person.personalien.geschlecht = this.newGeschlecht;
    this.person.personalien.nachname = this.newNachname;
    this.person.personalien.staatsangehoerigkeit = this.newStaatsangehoerigkeit;
    this.person.personalien.vorname = this.newVorname;
    this.person.personalien.ausweispflichtig = this.newAusweispflichtig;
    this.person.personalien.telefonnummer = this.newTelefonnummer;
    this.person.personalien.geheimdienstnotizen = this.newGeheimdienstnotizen;
    this.person.personalien.sicherheitsstufe = this.newSicherheitsstufe;
  }

  cancelEdit(): void {
    this.editable = false;
    this.loadPerson();
  }

}
