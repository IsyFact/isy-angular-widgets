import {FormControl, FormGroup} from '@angular/forms';
import {charsAndNumbers, onlyChars, onlyNumbers, required} from '../../shared/validation/validator';
import {Person} from '../../shared/model/person';

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
  return new FormGroup({
    id: new FormControl(person.id, requiredAndCharsAndNumbers)
  });
}

/**
 * @returns an initialized form group
 * Initializes the 'persoenlicheInformationen' Form
 * @param person A person with the existing values as input
 */
export function initPersoenlicheInformationenForm(person: Person): FormGroup {
  return new FormGroup({
    vorname: new FormControl(person.personalien.vorname, onlyChars),
    nachname: new FormControl(person.personalien.nachname, requiredAndOnlyChars),
    geschlecht: new FormControl(person.personalien.geschlecht, requiredAndOnlyChars)
  });
}

/**
 * @returns an initialized form group
 * Initializes the 'geburtsInformationen' Form
 * @param person A person with the existing values as input
 */
export function initGeburtsInformationenForm(person: Person): FormGroup {
  return new FormGroup({
    geburtsname: new FormControl(person.personalien.geburtsname, requiredAndOnlyChars),
    geburtsort: new FormControl(person.personalien.geburtsort, requiredAndOnlyChars),
    staatsangehoerigkeit: new FormControl(person.personalien.staatsangehoerigkeit, required),
    geburtsdatum: new FormControl(person.personalien.geburtsdatum, required)
  });
}

/**
 * @returns an initialized form group
 * Initializes the 'objektBearbeiten' Form
 * @param person A person with the existing values as input
 */
export function initObjektBearbeitenForm(person: Person): FormGroup {
  return new FormGroup({
    editID: new FormControl(person.id, requiredAndOnlyNumbers),
    editNachname: new FormControl(person.personalien.nachname, requiredAndCharsAndNumbers),
    editGeburtsname: new FormControl(person.personalien.geburtsname, requiredAndOnlyChars),
    editGeburtsort: new FormControl(person.personalien.geburtsort, requiredAndOnlyChars),
    editVorname: new FormControl(person.personalien.vorname, requiredAndOnlyChars),
    editGeschlecht: new FormControl(person.personalien.geschlecht, required),
    editGeburtsdatum: new FormControl(person.personalien.geburtsdatum, required),
    editStaatsangehoerigkeit: new FormControl(person.personalien.staatsangehoerigkeit, required)
  });
}
