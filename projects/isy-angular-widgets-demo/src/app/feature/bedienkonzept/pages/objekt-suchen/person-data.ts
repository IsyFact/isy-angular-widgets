import {Person} from '../../../../shared/model/person';

/**
 * @returns a person
 * Returns an empty person with default values
 */
export function getEmptyPerson(): Person {
  return {
    id: '',
    personalData: {
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
    }, liste: []
  };
}

/**
 * Resets the values of a given person
 * @param person The person whose values are to be reset
 */
export function resetPerson(person: Person): void {
  person.id = '';
  person.personalData.nachname = '';
  person.personalData.vorname = '';
  person.personalData.geschlecht = '';
  person.personalData.geburtsdatum = '';
  person.personalData.geburtsort = '';
  person.personalData.staatsangehoerigkeit = '';
  person.personalData.geburtsname = '';
  person.personalData.ausweispflichtig = true;
  person.personalData.telefonnummer = '';
  person.personalData.sicherheitsstufe = 0;
  person.personalData.geheimdienstnotizen = '';
  person.personalData.einreisedatum = 'XX-XX-XXXX';
  person.liste = [];
}
