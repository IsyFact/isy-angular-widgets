import {FormControl, FormGroup} from '@angular/forms';
import {charsAndNumbers, onlyChars, required, onlyNumbers} from '../../../../shared/validation/validator';
import {Person} from '../../../../shared/model/person';

/**
 * An Array with 2 validation rules: [required, allow only numbers]
 */
const requiredAndOnlyNumbers = [required, onlyNumbers];

/**
 * An Array with 2 validation rules: [required, allow only characters]
 */
const requiredAndOnlyChars = [required, onlyChars];

/**
 * An Array with 2 validation rules: [requires, allow only characters (including German letters and numbers]
 */
const requiredAndCharsAndNumbers = [required, charsAndNumbers];

/**
 * @returns an initialized form group
 * Initializes the 'id' Form
 * @param person A person with the existing values as input
 */
export function initIdForm(person: Person): FormGroup {
  return new FormGroup(
    {
      id: new FormControl(person.id, requiredAndCharsAndNumbers)
    }
  );
}

/**
 * @returns an initialized form group
 * Initializes the 'persoenlicheInformationen' Form
 * @param person A person with the existing values as input
 */
export function initPersoenlicheInformationenForm(person: Person): FormGroup {
  return new FormGroup(
    {
      vorname: new FormControl(person.personalData.firstName, onlyChars),
      nachname: new FormControl(person.personalData.lastName, requiredAndOnlyChars),
      geschlecht: new FormControl(person.personalData.gender, requiredAndOnlyChars)
    }
  );
}

/**
 * @returns an initialized form group
 * Initializes the 'geburtsInformationen' Form
 * @param person A person with the existing values as input
 */
export function initGeburtsInformationenForm(person: Person): FormGroup {
  return new FormGroup(
    {
      geburtsname: new FormControl(person.personalData.birthName, requiredAndOnlyChars),
      geburtsort: new FormControl(person.personalData.birthplace, requiredAndOnlyChars),
      staatsangehoerigkeit: new FormControl(person.personalData.nationality, required),
      geburtsdatum: new FormControl(person.personalData.birthDate, required)
    }
  );
}

/**
 * @returns an initialized form group
 * Initializes the 'objektBearbeiten' Form
 * @param person A person with the existing values as input
 */
export function initObjektBearbeitenForm(person: Person): FormGroup {
  return new FormGroup(
    {
      editID: new FormControl(person.id, requiredAndOnlyNumbers),
      editNachname: new FormControl(person.personalData.lastName, requiredAndCharsAndNumbers),
      editGeburtsname: new FormControl(person.personalData.birthName, requiredAndOnlyChars),
      editGeburtsort: new FormControl(person.personalData.birthplace, requiredAndOnlyChars),
      editVorname: new FormControl(person.personalData.firstName, requiredAndOnlyChars),
      editGeschlecht: new FormControl(person.personalData.gender, required),
      editGeburtsdatum: new FormControl(person.personalData.birthDate, required),
      editStaatsangehoerigkeit : new FormControl(person.personalData.nationality, required)
    }
  );
}
