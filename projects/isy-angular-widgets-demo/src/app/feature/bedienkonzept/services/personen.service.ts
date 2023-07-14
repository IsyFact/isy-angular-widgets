import {Person} from '../../../shared/model/person';
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

  findPersonById(id: string): Observable<Person[]> {
    return of<Person[]>([{
      id: id,
      personalData: {
        nachname: 'Wilhelm',
        vorname: 'Frederik',
        geschlecht: 'x',
        geburtsdatum: '01.01.1337',
        geburtsort: 'England',
        staatsangehoerigkeit: 'Französisch',
        birthName: 'Franziska',
        idRequired: true,
        phoneNumber: '',
        securityLevel: 0,
        intelligenceNotes: '',
        dateOfEntry: 'XX-XX-XXXX'
      },
      liste: []
    }]);
  }

  findPersonenByParameters(person: Person): Observable<Person[]> {
    const persons: Person[] = [];

    if (this.searchParametersAvailable(person)) {
      for (let i = 0; i < this.rng(); i++) {
        persons.push(this.mergePersons(person, this.generatePerson()));
      }
      return of<Person[]>(persons);
    }
    for (let i = 0; i < this.maxEntries; i++)
      persons.push(this.generatePerson());

    return of<Person[]>(persons);
  }

  searchParametersAvailable(person: Person): boolean {
    return person.personalData.nachname !== ''
      || person.personalData.vorname !== ''
      || person.personalData.geschlecht !== ''
      || person.personalData.geburtsdatum !== ''
      || person.personalData.geburtsort !== ''
      || !(person.personalData.staatsangehoerigkeit === '' || person.personalData.staatsangehoerigkeit === null)
      || person.personalData.birthName !== '';
  }

  generatePerson(): Person {
    return {
      id: this.rng().toString(), personalData: {
        nachname: this.nachname[this.rng()],
        vorname: this.vorname[this.rng()],
        geschlecht: 'x',
        geburtsdatum: '01.01.1337',
        geburtsort: this.staaten[this.rng()],
        staatsangehoerigkeit: this.staaten[this.rng()],
        birthName: this.nachname[this.rng()],
        idRequired: true,
        phoneNumber: '',
        securityLevel: 0,
        intelligenceNotes: '',
        dateOfEntry: 'XX-XX-XXXX'
      },
      liste: []
    };
  }

  mergePersons(suche: Person, generiert: Person): Person {
    if (suche.personalData.nachname !== '') {
      generiert.personalData.nachname = suche.personalData.nachname;
    }
    if (suche.personalData.vorname !== '') {
      generiert.personalData.vorname = suche.personalData.vorname;
    }
    if (suche.personalData.geschlecht !== '') {
      generiert.personalData.geschlecht = suche.personalData.geschlecht;
    }
    if (suche.personalData.geburtsdatum) {
      generiert.personalData.geburtsdatum = suche.personalData.geburtsdatum;
    }
    if (suche.personalData.geburtsort !== '') {
      generiert.personalData.geburtsort = suche.personalData.geburtsort;
    }
    if (suche.personalData.staatsangehoerigkeit !== '' && suche.personalData.staatsangehoerigkeit !== null) {
      generiert.personalData.staatsangehoerigkeit = suche.personalData.staatsangehoerigkeit;
    }
    if (suche.personalData.birthName !== '') {
      generiert.personalData.birthName = suche.personalData.birthName;
    }
    return generiert;
  }

  rng(): number {
    const crypto = window.crypto;
    return (crypto.getRandomValues(new Uint32Array(1)))[0]%this.maxEntries
  }
}

