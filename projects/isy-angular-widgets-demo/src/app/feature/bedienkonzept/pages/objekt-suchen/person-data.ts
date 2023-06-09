import {Person} from '../../../../shared/model/person';

/**
 * @returns a person
 * Returns an empty person with default values
 */
export function getEmptyPerson(): Person {
  return {
    id: '',
    personalien: {
      nachname: '',
      vorname: '',
      geschlecht: '',
      geburtsdatum: '',
      geburtsort: '',
      staatsangehoerigkeit: '',
      geburtsname: '',
      ausweispflichtig: true,
      telefonnummer: '',
      sicherheitsstufe: 0,
      geheimdienstnotizen: '',
      einreisedatum: 'XX-XX-XXXX'
    }, sachverhalte: {
      liste: []
    }
  };
}

/**
 * Resets the values of a given person
 * @param person The person whose values are to be reset
 */
export function resetPerson(person: Person): void {
  person.id = '';
  person.personalien.nachname = '';
  person.personalien.vorname = '';
  person.personalien.geschlecht = '';
  person.personalien.geburtsdatum = '';
  person.personalien.geburtsort = '';
  person.personalien.staatsangehoerigkeit = '';
  person.personalien.geburtsname = '';
  person.personalien.ausweispflichtig = true;
  person.personalien.telefonnummer = '';
  person.personalien.sicherheitsstufe = 0;
  person.personalien.geheimdienstnotizen = '';
  person.personalien.einreisedatum = 'XX-XX-XXXX';
  person.sachverhalte.liste = [];
}
