/**
 * A regex that only allows characters (including German characters).
 */
export const ONLY_CHARS_REGEX: RegExp = /^[a-zA-Z-äöüÄÖÜß]*$/;

/**
 * A regex that only allows numbers.
 */
export const ONLY_NUMBERS_REGEX: RegExp = /^\d*$/;

/**
 * A regex that only allows characters (including German characters) and numbers.
 */
export const CHARS_AND_NUMBERS: RegExp = /^[0-9a-zA-Z-äöüÄÖÜß]*$/;
