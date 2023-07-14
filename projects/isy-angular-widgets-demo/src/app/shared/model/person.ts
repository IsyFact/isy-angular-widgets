/**
 * An interface that defines a person.
 */
export interface Person {
  id: string;
  personalData: Personalien,
  facts: string[]
}

/**
 * An interface that defines a person's personal details.
 */
export interface Personalien {
  lastName: string;
  firstName: string;
  gender: string;
  birthDate: string;
  birthplace: string;
  nationality: string;
  birthName: string;
  idRequired: boolean;
  phoneNumber: string;
  securityLevel: number;
  intelligenceNotes: string;
  dateOfEntry: string;
}

/**
 * An interface used for the data type definition of a person ID.
 */
export interface PersonId {
  id: string;
}
