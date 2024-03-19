/**
 * An interface that defines a person.
 */
export interface Person {
  id: string;
  personalien: Personalien;
  sachverhalte: string[];
}

/**
 * An interface that defines a person's personal details.
 */
export interface Personalien {
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string;
  geburtsort: string;
  staatsangehoerigkeit: string;
  geburtsname: string;
  ausweispflichtig: boolean;
  telefonnummer: string;
  sicherheitsstufe: number;
  geheimdienstnotizen: string;
  einreisedatum: string;
  abreisedatum: string;
  ablaufdatumReisepass: string;
  kreditkartennummer: string;
  ablaufdatumKreditkarte: string;
  identityDocument: unknown;
  bilanz: number;
  status: string;
  address?: Address[];
}

/**
 * An interface used for the data type definition of a person ID.
 */
export interface PersonId {
  id: string;
}

/**
 * An interface used for the persons address
 */
interface Address {
  street: string;
  number: number | string;
  zip: number;
  city: string;
  country: string;
}
