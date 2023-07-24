import {getEmptyPerson, resetPerson} from './person-data';
import {Person} from '../../../../shared/model/person';

describe('person-data', () => {
  const person: Person = getEmptyPerson();

  it('should check the generation of an empty person', () => {
    expect(person.id).toEqual('');
    expect(person.personalien.nachname).toEqual('');
    expect(person.personalien.vorname).toEqual('');
    expect(person.personalien.geschlecht).toEqual('');
    expect(person.personalien.geburtsdatum).toEqual('');
    expect(person.personalien.geburtsort).toEqual('');
    expect(person.personalien.staatsangehoerigkeit).toEqual('');
    expect(person.personalien.geburtsname).toEqual('');
    expect(person.personalien.ausweispflichtig).toEqual(true);
    expect(person.personalien.telefonnummer).toEqual('');
    expect(person.personalien.sicherheitsstufe).toEqual(0);
    expect(person.personalien.geheimdienstnotizen).toEqual('');
    expect(person.personalien.einreisedatum).toEqual('XX-XX-XXXX');
    expect(person.sachverhalte).toEqual([]);
  });

  it('should check the reset of a person', () => {
    person.id = 'id';
    person.personalien.ausweispflichtig = false;
    person.personalien.sicherheitsstufe = 1;
    person.personalien.einreisedatum = '01-01-2022';
    person.sachverhalte = [
      'a',
      'b'
    ];
    resetPerson(person);

    expect(person.id).toEqual('');
    expect(person.personalien.nachname).toEqual('');
    expect(person.personalien.vorname).toEqual('');
    expect(person.personalien.geschlecht).toEqual('');
    expect(person.personalien.geburtsdatum).toEqual('');
    expect(person.personalien.geburtsort).toEqual('');
    expect(person.personalien.staatsangehoerigkeit).toEqual('');
    expect(person.personalien.geburtsname).toEqual('');
    expect(person.personalien.ausweispflichtig).toEqual(true);
    expect(person.personalien.telefonnummer).toEqual('');
    expect(person.personalien.sicherheitsstufe).toEqual(0);
    expect(person.personalien.geheimdienstnotizen).toEqual('');
    expect(person.personalien.einreisedatum).toEqual('XX-XX-XXXX');
    expect(person.sachverhalte).toEqual([]);
  });
});