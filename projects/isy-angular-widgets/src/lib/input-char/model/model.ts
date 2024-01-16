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

export enum ButtonType {
  /* Alle button */
  ALLE = 'ALLE',
  /* Grundzeichen button */
  GRUNDZEICHEN = 'GRUNDZEICHEN',
  /* Schriftzeichen button */
  SCHRIFTZEICHEN = 'SCHRIFTZEICHEN'
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

export interface SelectButtonOptions {
  readonly all: {label: string}[];
  readonly grundzeichen: string[];
  readonly schriftzeichenGruppen: Schriftzeichengruppe[];
}
