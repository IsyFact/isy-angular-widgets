import {getEmptyPerson, resetPerson} from './person-data';
import {Person} from '../../../../shared/model/person';

describe('person-data', () => {
  const person: Person = getEmptyPerson();

  it('should check the generation of an empty person', () => {
    expect(person.id).toEqual('');
    expect(person.personalData.lastName).toEqual('');
    expect(person.personalData.firstName).toEqual('');
    expect(person.personalData.gender).toEqual('');
    expect(person.personalData.birthDate).toEqual('');
    expect(person.personalData.birthplace).toEqual('');
    expect(person.personalData.nationality).toEqual('');
    expect(person.personalData.birthName).toEqual('');
    expect(person.personalData.idRequired).toEqual(true);
    expect(person.personalData.phoneNumber).toEqual('');
    expect(person.personalData.securityLevel).toEqual(0);
    expect(person.personalData.intelligenceNotes).toEqual('');
    expect(person.personalData.dateOfEntry).toEqual('XX-XX-XXXX');
    expect(person.facts.liste).toEqual([]);
  });

  it('should check the reset of a person', () => {
    person.id = 'id';
    person.personalData.idRequired = false;
    person.personalData.securityLevel = 1;
    person.personalData.dateOfEntry = '01-01-2022';
    person.facts.liste = [
      'a',
      'b'
    ];
    resetPerson(person);

    expect(person.id).toEqual('');
    expect(person.personalData.lastName).toEqual('');
    expect(person.personalData.firstName).toEqual('');
    expect(person.personalData.gender).toEqual('');
    expect(person.personalData.birthDate).toEqual('');
    expect(person.personalData.birthplace).toEqual('');
    expect(person.personalData.nationality).toEqual('');
    expect(person.personalData.birthName).toEqual('');
    expect(person.personalData.idRequired).toEqual(true);
    expect(person.personalData.phoneNumber).toEqual('');
    expect(person.personalData.securityLevel).toEqual(0);
    expect(person.personalData.intelligenceNotes).toEqual('');
    expect(person.personalData.dateOfEntry).toEqual('XX-XX-XXXX');
    expect(person.facts.liste).toEqual([]);
  });
});
