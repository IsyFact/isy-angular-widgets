/**
 * Interface representing the allowed signs for validation.
 * allowed: codepoints that are defined/allowed in the character set
 * diacritic: codepoints that are only allowed in combination with one or two previous characters
 */
export interface AllowedSigns {
  diacritic?: {[key: string]: boolean};
  allowed: {[key: string]: boolean};
}

/**
 * Interface representing the allowed characters for DIN 91379 validation.
 */
export interface Din91379Characters {
  latin: AllowedSigns;
  n1: AllowedSigns;
  n2: AllowedSigns;
  n3: AllowedSigns;
  n4: AllowedSigns;
  e1: AllowedSigns;
  eGreek: AllowedSigns;
  eCyrillic: AllowedSigns;
}
