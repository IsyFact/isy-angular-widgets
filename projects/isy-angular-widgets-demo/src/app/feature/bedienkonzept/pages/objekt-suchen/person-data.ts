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
      birthName: '',
      idRequired: true,
      phoneNumber: '',
      securityLevel: 0,
      intelligenceNotes: '',
      dateOfEntry: 'XX-XX-XXXX'
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
  person.personalData.birthName = '';
  person.personalData.idRequired = true;
  person.personalData.phoneNumber = '';
  person.personalData.securityLevel = 0;
  person.personalData.intelligenceNotes = '';
  person.personalData.dateOfEntry = 'XX-XX-XXXX';
  person.liste = [];
}
