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
        lastName: 'Wilhelm',
        firstName: 'Frederik',
        gender: 'x',
        birthDate: '01.01.1337',
        birthplace: 'England',
        nationality: 'Französisch',
        birthName: 'Franziska',
        idRequired: true,
        phoneNumber: '',
        securityLevel: 0,
        intelligenceNotes: '',
        dateOfEntry: 'XX-XX-XXXX'
      },
      facts: []
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
    return person.personalData.lastName !== ''
      || person.personalData.firstName !== ''
      || person.personalData.gender !== ''
      || person.personalData.birthDate !== ''
      || person.personalData.birthplace !== ''
      || !(person.personalData.nationality === '' || person.personalData.nationality === null)
      || person.personalData.birthName !== '';
  }

  generatePerson(): Person {
    return {
      id: this.rng().toString(), personalData: {
        lastName: this.nachname[this.rng()],
        firstName: this.vorname[this.rng()],
        gender: 'x',
        birthDate: '01.01.1337',
        birthplace: this.staaten[this.rng()],
        nationality: this.staaten[this.rng()],
        birthName: this.nachname[this.rng()],
        idRequired: true,
        phoneNumber: '',
        securityLevel: 0,
        intelligenceNotes: '',
        dateOfEntry: 'XX-XX-XXXX'
      },
      facts: []
    };
  }

  mergePersons(suche: Person, generiert: Person): Person {
    if (suche.personalData.lastName !== '') {
      generiert.personalData.lastName = suche.personalData.lastName;
    }
    if (suche.personalData.firstName !== '') {
      generiert.personalData.firstName = suche.personalData.firstName;
    }
    if (suche.personalData.gender !== '') {
      generiert.personalData.gender = suche.personalData.gender;
    }
    if (suche.personalData.birthDate) {
      generiert.personalData.birthDate = suche.personalData.birthDate;
    }
    if (suche.personalData.birthplace !== '') {
      generiert.personalData.birthplace = suche.personalData.birthplace;
    }
    if (suche.personalData.nationality !== '' && suche.personalData.nationality !== null) {
      generiert.personalData.nationality = suche.personalData.nationality;
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

