import {getEmptyPerson, resetPerson} from './person-data';
import {Person} from '../../shared/model/person';

describe('Unit Tests: person-data', () => {
  const person: Person = getEmptyPerson();

  /**
   * Checks if the current person is empty
   */
  function expectPersonToBeEmpty(): void {
    expect(person.id).toEqual('');
    expect(person.personalien.nachname).toEqual('');
    expect(person.personalien.vorname).toEqual('');
    expect(person.personalien.gender).toEqual('');
    expect(person.personalien.geburtsdatum).toEqual('');
    expect(person.personalien.geburtsort).toEqual('');
    expect(person.personalien.staatsangehoerigkeit).toEqual('');
    expect(person.personalien.geburtsname).toEqual('');
    expect(person.personalien.ausweispflichtig).toEqual(true);
    expect(person.personalien.telefonnummer).toEqual('');
    expect(person.personalien.sicherheitsstufe).toEqual(0);
    expect(person.personalien.geheimdienstnotizen).toEqual('');
    expect(person.personalien.einreisedatum).toEqual('xx.xx.xxxx');
    expect(person.personalien.abreisedatum).toEqual('xx.xx.xxxx');
    expect(person.personalien.ablaufdatumPersonalausweis).toEqual('');
    expect(person.personalien.ablaufdatumReisepass).toEqual('');
    expect(person.personalien.kreditkartennummer).toEqual('');
    expect(person.personalien.ablaufdatumKreditkarte).toEqual('');
    expect(person.personalien.bilanz).toEqual(0);
    expect(person.personalien.state).toEqual('');
    expect(person.sachverhalte).toEqual([]);
  }

  it('should generate an empty person', () => {
    expectPersonToBeEmpty();
  });

  it('should reset a person', () => {
    person.id = 'id';
    person.personalien.ausweispflichtig = false;
    person.personalien.sicherheitsstufe = 1;
    person.personalien.einreisedatum = '01.01.2022';
    person.sachverhalte = ['a', 'b'];
    resetPerson(person);
    expectPersonToBeEmpty();
  });
});
