/**
 * @internal
 */
export enum Schriftzeichengruppe {
  /** Lateinische Buchstaben. */
  LATEIN = 'LATEIN',

  /** Nicht-Buchstaben N1. */
  N1 = 'N1',

  /** Nicht-Buchstaben N2. */
  N2 = 'N2',

  /** Nicht-Buchstaben N3. */
  N3 = 'N3',

  /** Nicht-Buchstaben N4. */
  N4 = 'N4',

  /** Nicht-Buchstaben E1. */
  E1 = 'E1',

  /** Griechische Buchstaben. */
  GRIECHISCH = 'GRIECHISCH',

  /** Kyrillische Buchstaben. */
  KYRILLISCH = 'KYRILLISCH'
}

/**
 * @internal
 */
export enum ButtonTypeIdentifier {
  /* Grundzeichen button */
  GRUNDZEICHEN = 'GRUNDZEICHEN',
  /* Schriftzeichen button */
  SCHRIFTZEICHENGRUPPE = 'SCHRIFTZEICHENGRUPPE'
}

/**
 * @internal
 */
export interface Zeichenobjekt {
  readonly zeichen: string;
  readonly grundzeichen: string;
  readonly schriftzeichengruppe: Schriftzeichengruppe;
  readonly name: string;
  readonly codepoint: string;
}

/**
 * @internal
 */
export interface InputCharData {
  [key: string]: string[];
}

/**
 * @internal
 */
export interface ZeichenSelection {
  identifier: string;
  zeichen: string;
}
