/**
 * An interface that defines a person.
 */
export interface Person {
  id: string;
  personalien: Personalien,
  liste: string[];
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
}

/**
 * An interface used for the data type definition of a person ID.
 */
export interface PersonId {
  id: string;
}
