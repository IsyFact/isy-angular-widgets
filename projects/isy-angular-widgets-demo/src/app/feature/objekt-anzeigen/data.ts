import {Person} from '../../shared/model/person';

export const initializedPerson: Person = {
  id: '1',
  personalien: {
    geburtsdatum: '03.08.1980',
    geburtsname: 'Mustermann',
    geburtsort: 'Köln',
    geschlecht: 'Männlich',
    nachname: 'Mustermann',
    staatsangehoerigkeit: 'Deutsch',
    vorname: 'Max',
    ausweispflichtig: true,
    telefonnummer: '',
    geheimdienstnotizen: '',
    sicherheitsstufe: 0,
    einreisedatum: 'xx.xx.2000',
    abreisedatum: 'xx.xx.2024',
    ablaufdatumReisepass: '',
    kreditkartennummer: '',
    ablaufdatumKreditkarte: '',
    identityDocument: '',
    bilanz: 0,
    status: '',
    addresses: [
      {
        street: 'Frankfurterstr.',
        number: 6,
        zip: 12345,
        city: 'Köln',
        country: 'Deutschland'
      }
    ]
  },
  sachverhalte: [
    'Hat einen Antrag auf BAFÖG gestellt',
    'Wurde wegen Falschparkens ermahnt',
    'Steht auf der NO-FLY-Liste'
  ]
};
