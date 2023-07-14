import {getEmptyPerson, resetPerson} from './person-data';
import {Person} from '../../../../shared/model/person';

describe('person-data', () => {
  const person: Person = getEmptyPerson();

  it('should check the generation of an empty person', () => {
    expect(person.id).toEqual('');
    expect(person.personalData.nachname).toEqual('');
    expect(person.personalData.vorname).toEqual('');
    expect(person.personalData.geschlecht).toEqual('');
    expect(person.personalData.geburtsdatum).toEqual('');
    expect(person.personalData.geburtsort).toEqual('');
    expect(person.personalData.staatsangehoerigkeit).toEqual('');
    expect(person.personalData.geburtsname).toEqual('');
    expect(person.personalData.ausweispflichtig).toEqual(true);
    expect(person.personalData.telefonnummer).toEqual('');
    expect(person.personalData.sicherheitsstufe).toEqual(0);
    expect(person.personalData.geheimdienstnotizen).toEqual('');
    expect(person.personalData.einreisedatum).toEqual('XX-XX-XXXX');
    expect(person.liste).toEqual([]);
  });

  it('should check the reset of a person', () => {
    person.id = 'id';
    person.personalData.ausweispflichtig = false;
    person.personalData.sicherheitsstufe = 1;
    person.personalData.einreisedatum = '01-01-2022';
    person.liste = [
      'a',
      'b'
    ];
    resetPerson(person);

    expect(person.id).toEqual('');
    expect(person.personalData.nachname).toEqual('');
    expect(person.personalData.vorname).toEqual('');
    expect(person.personalData.geschlecht).toEqual('');
    expect(person.personalData.geburtsdatum).toEqual('');
    expect(person.personalData.geburtsort).toEqual('');
    expect(person.personalData.staatsangehoerigkeit).toEqual('');
    expect(person.personalData.geburtsname).toEqual('');
    expect(person.personalData.ausweispflichtig).toEqual(true);
    expect(person.personalData.telefonnummer).toEqual('');
    expect(person.personalData.sicherheitsstufe).toEqual(0);
    expect(person.personalData.geheimdienstnotizen).toEqual('');
    expect(person.personalData.einreisedatum).toEqual('XX-XX-XXXX');
    expect(person.liste).toEqual([]);
  });
});
