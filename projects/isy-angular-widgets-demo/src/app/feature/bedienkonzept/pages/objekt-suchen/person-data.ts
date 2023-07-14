import {Person} from '../../../../shared/model/person';

/**
 * @returns a person
 * Returns an empty person with default values
 */
export function getEmptyPerson(): Person {
  return {
    id: '',
    personalData: {
      lastName: '',
      firstName: '',
      gender: '',
      birthDate: '',
      birthplace: '',
      nationality: '',
      birthName: '',
      idRequired: true,
      phoneNumber: '',
      securityLevel: 0,
      intelligenceNotes: '',
      dateOfEntry: 'XX-XX-XXXX'
    }, facts: []
  };
}

/**
 * Resets the values of a given person
 * @param person The person whose values are to be reset
 */
export function resetPerson(person: Person): void {
  person.id = '';
  person.personalData.lastName = '';
  person.personalData.firstName = '';
  person.personalData.gender = '';
  person.personalData.birthDate = '';
  person.personalData.birthplace = '';
  person.personalData.nationality = '';
  person.personalData.birthName = '';
  person.personalData.idRequired = true;
  person.personalData.phoneNumber = '';
  person.personalData.securityLevel = 0;
  person.personalData.intelligenceNotes = '';
  person.personalData.dateOfEntry = 'XX-XX-XXXX';
  person.facts = [];
}
