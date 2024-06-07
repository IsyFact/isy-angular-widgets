import {Person} from '../model/person';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonenService {
  private readonly maxEntries = 30;

  vorname: string[] = [
    'Lucy',
    'Lukas',
    'Ella',
    'Konstantin',
    'Amy',
    'Ben',
    'Emely',
    'Jonas',
    'Finja',
    'Elias',
    'Amelie',
    'Niklas',
    'Luise',
    'David',
    'Frieda',
    'Oskar',
    'Katharina',
    'Philipp',
    'Romy',
    'Leon',
    'Juna',
    'Noah',
    'Theresa',
    'Luis',
    'Eva',
    'Paul',
    'Julia',
    'Finn',
    'Anna',
    'Felix'
  ];

  nachname: string[] = [
    'Müller',
    'Schmidt',
    'Schneider',
    'Fischer',
    'Weber',
    'Meyer',
    'Wagner',
    'Schulz',
    'Becker',
    'Hoffmann',
    'Schäfer',
    'Koch',
    'Richter',
    'Bauer',
    'Klein',
    'Wolf',
    'Schröder',
    'Neumann',
    'Schwarz',
    'Zimmermann',
    'Braun',
    'Hofmann',
    'Krüger',
    'Hartmann',
    'Lange',
    'Schmitt',
    'Werner',
    'Schmitz',
    'Krause',
    'Meier'
  ];

  staaten: string[] = [
    'Belgien',
    'Malta',
    'Bulgarien',
    'Niederlande',
    'Dänemark',
    'Österreich',
    'Deutschland',
    'Polen',
    'Estland',
    'Portugal',
    'Finnland',
    'Rumänien',
    'Frankreich',
    'Schweden',
    'Griechenland',
    'Slowakei',
    'Irland',
    'Slowenien',
    'Italien',
    'Spanien',
    'Kroatien',
    'Tschechien',
    'Lettland',
    'Ungarn',
    'Litauen',
    'Zypern',
    'Luxemburg',
    'Schweiz',
    'Norwegen',
    'Island'
  ];

  gender: string[] = [
    'isyAngularWidgetsDemo.labels.female',
    'isyAngularWidgetsDemo.labels.male',
    'isyAngularWidgetsDemo.labels.divers'
  ];

  state: string[] = [
    'isyAngularWidgetsDemo.labels.unqualified',
    'isyAngularWidgetsDemo.labels.qualified',
    'isyAngularWidgetsDemo.labels.new',
    'isyAngularWidgetsDemo.labels.negotiation',
    'isyAngularWidgetsDemo.labels.renewal',
    'isyAngularWidgetsDemo.labels.proposal'
  ];

  bilanz: {min: number; max: number} = {min: 60000, max: 100000};

  findPersonById(id: string): Observable<Person[]> {
    return of<Person[]>([
      {
        id: id,
        personalien: {
          nachname: 'Wilhelm',
          vorname: 'Frederik',
          gender: 'Männlich',
          geburtsdatum: '01.01.1337',
          geburtsort: 'England',
          staatsangehoerigkeit: 'Französisch',
          geburtsname: 'Franziska',
          ausweispflichtig: true,
          telefonnummer: '',
          sicherheitsstufe: 0,
          geheimdienstnotizen: '',
          einreisedatum: 'xx.xx.xxxx',
          abreisedatum: 'xx.xx.xxxx',
          ablaufdatumPersonalausweis: '',
          ablaufdatumReisepass: '',
          kreditkartennummer: '',
          ablaufdatumKreditkarte: '',
          identityDocument: '',
          bilanz: 0,
          state: ''
        },
        sachverhalte: []
      }
    ]);
  }

  findPersonenByParameters(person: Person): Observable<Person[]> {
    const persons: Person[] = [];

    if (this.searchParametersAvailable(person)) {
      for (let i = 0; i < this.rng(); i++) {
        persons.push(this.mergePersons(person, this.generatePerson()));
      }
      return of<Person[]>(persons);
    }
    for (let i = 0; i < this.maxEntries; i++) persons.push(this.generatePerson());

    return of<Person[]>(persons);
  }

  searchParametersAvailable(person: Person): boolean {
    return (
      person.personalien.nachname !== '' ||
      person.personalien.vorname !== '' ||
      person.personalien.gender !== '' ||
      person.personalien.geburtsdatum !== '' ||
      person.personalien.geburtsort !== '' ||
      !(person.personalien.staatsangehoerigkeit === '' || person.personalien.staatsangehoerigkeit === null) ||
      person.personalien.geburtsname !== ''
    );
  }

  generatePerson(): Person {
    return {
      id: this.rng().toString(),
      personalien: {
        nachname: this.nachname[this.rng()],
        vorname: this.vorname[this.rng()],
        gender: this.rStr(this.gender),
        geburtsdatum: '01.01.1337',
        geburtsort: this.staaten[this.rng()],
        staatsangehoerigkeit: this.staaten[this.rng()],
        geburtsname: this.nachname[this.rng()],
        ausweispflichtig: true,
        telefonnummer: '',
        sicherheitsstufe: 0,
        geheimdienstnotizen: '',
        einreisedatum: 'xx.xx.xxxx',
        abreisedatum: 'xx.xx.xxxx',
        ablaufdatumPersonalausweis: '',
        ablaufdatumReisepass: '',
        kreditkartennummer: '',
        ablaufdatumKreditkarte: '',
        identityDocument: '',
        bilanz: this.rNum(this.bilanz.min, this.bilanz.max),
        state: this.rStr(this.state)
      },
      sachverhalte: []
    };
  }

  mergePersons(suche: Person, generiert: Person): Person {
    if (suche.personalien.nachname !== '') {
      generiert.personalien.nachname = suche.personalien.nachname;
    }
    if (suche.personalien.vorname !== '') {
      generiert.personalien.vorname = suche.personalien.vorname;
    }
    if (suche.personalien.gender !== '') {
      generiert.personalien.gender = suche.personalien.gender;
    }
    if (suche.personalien.geburtsdatum) {
      generiert.personalien.geburtsdatum = suche.personalien.geburtsdatum;
    }
    if (suche.personalien.geburtsort !== '') {
      generiert.personalien.geburtsort = suche.personalien.geburtsort;
    }
    if (suche.personalien.staatsangehoerigkeit !== '' && suche.personalien.staatsangehoerigkeit !== null) {
      generiert.personalien.staatsangehoerigkeit = suche.personalien.staatsangehoerigkeit;
    }
    if (suche.personalien.geburtsname !== '') {
      generiert.personalien.geburtsname = suche.personalien.geburtsname;
    }
    return generiert;
  }

  rng(): number {
    const crypto = window.crypto;
    return crypto.getRandomValues(new Uint32Array(1))[0] % this.maxEntries;
  }

  rStr(list: string[]): string {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  rNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
