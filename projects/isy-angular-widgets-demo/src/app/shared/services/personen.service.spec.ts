import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {PersonenService} from './personen.service';
import {Person} from '../model/person';

describe('Unit Tests: PersonenService', () => {
  const maxEntries = 30;
  const empty = '';
  let spectator: SpectatorService<PersonenService>;
  let service: PersonenService;
  const createdService = createServiceFactory(PersonenService);

  const mockedPerson: Person = {
    id: '0',
    personalien: {
      nachname: 'Wilhelm',
      vorname: 'Frederik',
      geschlecht: 'x',
      geburtsdatum: '01.01.1337',
      geburtsort: 'England',
      staatsangehoerigkeit: 'Französisch',
      geburtsname: 'Franziska',
      ausweispflichtig: true,
      telefonnummer: '',
      sicherheitsstufe: 0,
      geheimdienstnotizen: '',
      einreisedatum: 'xx.xx.xxxx',
      abreisedatum: 'xx.xx.xxxx',
      ablaufdatumPersonalausweis: '',
      ablaufdatumReisepass: '',
      kreditkartennummer: '',
      ablaufdatumKreditkarte: '',
      identityDocument: '',
      bilanz: 0,
      status: ''
    },
    sachverhalte: []
  };

  beforeEach(() => {
    spectator = createdService();
    service = spectator.service;
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should generate a new person', () => {
    const person = spectator.service.generatePerson();
    const personalien = person.personalien;

    const isVornameIncluded = service.vorname.includes(personalien.vorname);
    expect(isVornameIncluded).toBeTrue();

    const isNachnameIncluded = service.nachname.includes(personalien.nachname);
    expect(isNachnameIncluded).toBeTrue();

    const isGeburtsnameIncluded = service.nachname.includes(personalien.geburtsname);
    expect(isGeburtsnameIncluded).toBeTrue();

    const isGeburtsortIncluded = service.staaten.includes(personalien.geburtsort);
    expect(isGeburtsortIncluded).toBeTrue();

    const isStaatsangehoerigkeitIncluded = service.staaten.includes(personalien.staatsangehoerigkeit);
    expect(isStaatsangehoerigkeitIncluded).toBeTrue();

    expect(personalien.ausweispflichtig).toBeTrue();
    expect(personalien.sicherheitsstufe).toEqual(0);

    const isGeschlechtIncluded = service.geschlechter.includes(personalien.geschlecht);
    expect(isGeschlechtIncluded).toBeTrue();

    expect(personalien.geburtsdatum).toEqual('01.01.1337');
    expect(personalien.einreisedatum).toEqual('xx.xx.xxxx');
    expect(personalien.abreisedatum).toEqual('xx.xx.xxxx');
    expect(personalien.telefonnummer).toBe(empty);
    expect(personalien.geheimdienstnotizen).toBe(empty);
    expect(personalien.ablaufdatumPersonalausweis).toBe(empty);
    expect(personalien.ablaufdatumReisepass).toBe(empty);
    expect(personalien.kreditkartennummer).toBe(empty);
    expect(personalien.ablaufdatumKreditkarte).toBe(empty);
    expect(personalien.bilanz).toBeGreaterThan(60000);
    expect(personalien.bilanz).toBeLessThan(100000);

    const isStatusIncluded = service.stati.includes(personalien.status);
    expect(isStatusIncluded).toBeTrue();

    expect(person.sachverhalte).toEqual([]);
  });

  it('search parameters should not be available', () => {
    const person = service.generatePerson();
    const personalien = person.personalien;
    personalien.vorname = '';
    personalien.nachname = '';
    personalien.geschlecht = '';
    personalien.geburtsdatum = '';
    personalien.geburtsort = '';
    personalien.staatsangehoerigkeit = '';
    personalien.geburtsname = '';

    const available = service.searchParametersAvailable(person);
    expect(available).toBeFalse();
  });

  it('should find person by id', () => {
    const foundPersonObservable = service.findPersonById('0');
    foundPersonObservable.subscribe((person) => {
      expect(person[0]).toEqual(mockedPerson);
    });
  });

  it('should find personen by parameters, with available search parameters', () => {
    const generatePerson = service.generatePerson();
    const foundPersonsObservable = service.findPersonenByParameters(generatePerson);
    foundPersonsObservable.subscribe((persons) => {
      expect(persons.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should found personen by parameters, without available search parameters', () => {
    const person = service.generatePerson();
    const personalien = person.personalien;
    personalien.vorname = '';
    personalien.nachname = '';
    personalien.geschlecht = '';
    personalien.geburtsdatum = '';
    personalien.geburtsort = '';
    personalien.staatsangehoerigkeit = '';
    personalien.geburtsname = '';

    const foundPersonsObservable = service.findPersonenByParameters(person);
    foundPersonsObservable.subscribe((person) => {
      expect(person.length).toBeGreaterThan(0);
    });
  });

  it('parameters should be available ', () => {
    const person = service.generatePerson();
    const paramsAvailable = service.searchParametersAvailable(person);
    expect(paramsAvailable).toBeTrue();
  });

  it('should merge the mocked person values into the new generated person', () => {
    const newPerson = service.generatePerson();
    const mergedPerson = service.mergePersons(mockedPerson, newPerson);

    expect(mergedPerson.personalien.nachname).toEqual(mockedPerson.personalien.nachname);
    expect(mergedPerson.personalien.vorname).toEqual(mockedPerson.personalien.vorname);
    expect(mergedPerson.personalien.geschlecht).toEqual(mockedPerson.personalien.geschlecht);
    expect(mergedPerson.personalien.geburtsdatum).toEqual(mockedPerson.personalien.geburtsdatum);
    expect(mergedPerson.personalien.geburtsort).toEqual(mockedPerson.personalien.geburtsort);
    expect(mergedPerson.personalien.staatsangehoerigkeit).toEqual(mockedPerson.personalien.staatsangehoerigkeit);
    expect(mergedPerson.personalien.geburtsname).toEqual(mockedPerson.personalien.geburtsname);
  });

  it('should be smaller or equal than max entries', () => {
    const rng = spectator.service.rng();
    expect(rng).toBeLessThanOrEqual(maxEntries);
  });
});
