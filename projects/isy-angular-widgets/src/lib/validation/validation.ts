import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import moment, {MomentInput} from 'moment';
import {
  INPUT_MASK_REGEX,
  INPUT_MASK_REGEX_ISO_DATE,
  INPUT_UNSPECIFIED_REGEX,
  INPUT_UNSPECIFIED_REGEX_ISO_DATE
} from './data/date-formats';
import {AllowedSigns, dinNorm91379Characters} from './data/din-norm-91379-characters';

/**
 * List of user-defined validators. Can be extended with additional static validators
 * TODO: Breaking changes - Review and update the naming of error message keys. For example, change UNSPECIFIEDDATE to INVALIDUNSPECIFIEDDATE
 */
export class Validation {
  /**
   * If the specified value is a valid date, it will be checked if the date is in the future.
   * If the date corresponds to today's date or is in the past, a "FUTURE" error is thrown.
   * For invalid dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {FUTURE: true} if the validation fails; null otherwise
   */
  static isInFuture(c: AbstractControl<MomentInput>): ValidationErrors | null {
    const today = moment().startOf('day');
    // It is not possible to check against a union type. Problem will disappear with moment.js replacement.
    const dateValue = moment(c.value, [moment.ISO_8601, 'DD.MM.YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY'], true);
    if (dateValue.isValid() && dateValue.isSameOrBefore(today)) {
      return {FUTURE: true};
    }
    return null;
  }

  /**
   * If the given value is a valid date, it will be checked if the date is in the past.
   * If the date is today's date or is in the future, a "PAST" error is thrown.
   * For invalid dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {PAST: true} if the validation fails; null otherwise
   */
  static isInPast(c: AbstractControl<MomentInput>): ValidationErrors | null {
    const today = moment().startOf('day');
    // It is not possible to check against a union type. Problem will disappear with moment.js replacement.
    const dateValue = moment(c.value, [moment.ISO_8601, 'DD.MM.YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY'], true);
    if (dateValue.isValid() && dateValue.isSameOrAfter(today)) {
      return {PAST: true};
    }
    return null;
  }

  /**
   * Checks that the date is a valid unspecified date or valid date in german format DD.MM.YYYY.
   * If the date in german format is not valid and not unspecified, a "DATE" error is thrown.
   * E.g. unspecified dates: 00.MM.YYYY, 00.00.YYYY, 00.00.0000, xx.MM.YYYY, xx.xx.YYYY, xx.xx.xxxx
   * For valid or valid unspecified dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @param allowZeroFormat If true, the zero date format should allowed
   * @returns The object {UNSPECIFIEDDATE: true} if the validation fails; null otherwise
   */
  static validUnspecifiedDate(c: AbstractControl, allowZeroFormat?: boolean): ValidationErrors | null {
    const input = (c.value as string) ?? null;

    if (!input) return null;

    let isDateValid = false;

    if (INPUT_MASK_REGEX.test(input)) {
      const [day, month, year] = input.split('.');
      const isoFormattedStr = `${year}-${month}-${day}`;

      if (year === '0000' && !allowZeroFormat) return {UNSPECIFIEDDATE: true};

      if (!(input.includes('x') || day === '00' || month === '00')) {
        const date = new Date(isoFormattedStr);
        const timestamp = date.getTime();

        if (!isNaN(timestamp)) isDateValid = date.toISOString().startsWith(isoFormattedStr);
      }
    }

    if (!(INPUT_UNSPECIFIED_REGEX.test(input) || isDateValid)) return {UNSPECIFIEDDATE: true};

    return null;
  }

  /**
   * Checks that the date is a valid unspecified date or valid date in ISO 8601 format YYYY-MM-DD.
   * If the date in ISO 8601 format is not valid and not unspecified, a "DATE" error is thrown.
   * E.g. unspecified dates: YYYY-MM-00, YYYY-00-00, 0000-00-00, YYYY-MM-xx, YYYY-xx-xx, xxxx-xx-xx
   * For valid or valid unspecified dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @param allowZeroFormat If true, the zero date format should allowed
   * @returns The object {UNSPECIFIEDISODATE: true} if the validation fails; null otherwise
   */
  static validUnspecifiedISODate(c: AbstractControl, allowZeroFormat = false): ValidationErrors | null {
    const input = (c.value as string) ?? null;

    if (!input) return null;

    let isDateValid = false;

    if (INPUT_MASK_REGEX_ISO_DATE.test(input)) {
      const [year, month, day] = input.split('-');
      const isoFormattedStr = `${year}-${month}-${day}`;

      if (year === '0000' && !allowZeroFormat) return {UNSPECIFIEDDATE: true};

      if (!(input.includes('x') || day === '00' || month === '00')) {
        const date = new Date(isoFormattedStr);
        const timestamp = date.getTime();

        if (!isNaN(timestamp)) isDateValid = date.toISOString().startsWith(isoFormattedStr);
      }
    }

    if (!(INPUT_UNSPECIFIED_REGEX_ISO_DATE.test(input) || isDateValid)) return {UNSPECIFIEDISODATE: true};

    return null;
  }

  /**
   * Checks that the date is a valid date. To be used as a factory that returns a validator function.
   * @param dateFormat The format to be checked.
   * @param strict Strict parsing means that an exact match is required - including delimiters, whitespaces, etc.
   * @param messageKey Key of the validator message
   * @returns A validator function with the given configuration
   */
  static dateFormat(dateFormat: string, strict: boolean, messageKey: string): ValidatorFn {
    return (c: AbstractControl<MomentInput>): ValidationErrors | null => {
      const input = c.value;
      if (!input) {
        return null;
      }
      const parsedDate = moment(input, dateFormat, strict);
      if (!dateFormat || !parsedDate?.isValid()) {
        return {[messageKey]: {format: dateFormat}};
      }

      return null;
    };
  }

  /**
   * Checks if the date is a valid credit card expiration date. The date must be in the future.
   * If the date is not a valid credit card expiration date, a "CREDITCARDEXPIRATIONDATE" error is thrown.
   * For valid credit card expiration dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {CREDITCARDEXPIRATIONDATE: true} if the validation fails; null otherwise
   */
  static validCreditCardExpirationDate(c: AbstractControl<MomentInput>): ValidationErrors | null {
    const today = moment().startOf('month');
    if (c.value !== '') {
      const dateValue = moment(c.value, ['MM/YY'], true);
      if (!dateValue.isValid() || dateValue.isBefore(today)) {
        return {CREDITCARDEXPIRATIONDATE: true};
      }
    }
    return null;
  }

  /**
   * Checks if the date is a valid date in ISO 8601 format.
   * @param c The control element the validator is appended to
   * @returns The object {DATE: true} if the validation fails; null otherwise
   */
  static isoDate(c: AbstractControl): ValidationErrors | null {
    const isoDateValidatorFn: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'DATE');
    return isoDateValidatorFn(c);
  }

  /**
   * Checks if it is a valid time in ISO 8601 format.
   * @param c The control element the validator is appended to
   * @returns The object {TIME: true} if the validation fails; null otherwise
   */
  static isoTime(c: AbstractControl): ValidationErrors | null {
    const isoTimeValidatorFn: ValidatorFn = Validation.dateFormat('HH:mm:ss', true, 'TIME');
    return isoTimeValidatorFn(c);
  }

  /**
   * Checks if the value of the control contains a valid date in ISO format.
   * @param c The control element the validator is appended to
   * @returns The object {DATETIME: true} if the validation fails; null otherwise
   */
  static isoDateTime(c: AbstractControl): ValidationErrors | null {
    const isoDateTimeValidatorFn: ValidatorFn = Validation.dateFormat('YYYY-MM-DDTHH:mm:ss[Z]', true, 'DATETIME');
    return isoDateTimeValidatorFn(c);
  }

  /**
   * Checks the entry to see if it is a valid credit card number. This is checked:
   * - If input contains characters other than numbers, spaces, hyphens, an error is returned.
   * - If the input is shorter than 12 characters or longer than 19 characters, an error is returned
   * - Luhn algorithm is applied to the input, if the result is NOT modulo 10, an error is returned.
   * @param c The control element the validator is appended to
   * @returns The object {CREDITCARD: true} if the validation fails; null otherwise
   */
  static validCreditCardNumber(c: AbstractControl): ValidationErrors | null {
    const minLength = 12,
      maxLength = 19;

    let value = c.value as string;
    if (!value) {
      return null;
    }

    // If the input contains characters other than Numbers
    if (/[^0-9-\s]+/.test(value)) {
      return {CREDITCARD: true};
    }

    if (value.length > maxLength || value.length < minLength) {
      return {CREDITCARD: true};
    }

    // Execution of the Luhn algorithm (specific fixed numbers required)
    const radix = 10;
    const digitsMultiplier = 2;
    let nCheck = 0;
    let bEven = false;

    value = value.replace(/\D/g, '');

    for (let n = value.length - 1; n >= 0; n--) {
      const cDigit = value.charAt(n);
      let nDigit = parseInt(cDigit, radix);

      if (bEven) {
        if ((nDigit *= digitsMultiplier) > radix - 1) {
          nDigit -= radix - 1;
        }
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    if (nCheck % radix !== 0) {
      return {CREDITCARD: true};
    }

    return null;
  }

  /**
   * Checks whether the provided input matches the complex patterns defined in the given data type.
   * If the input does not meet these criteria, the function returns a validation error. Otherwise, it returns null,
   * indicating that the input is valid.
   * @param datentyp The available types are A, B, C, D, and E. If none is specified, type C is used for validation by default.
   * @returns A validator function that can be used to validate the form field.
   */
  static validateDIN91379(datentyp: 'A' | 'B' | 'C' | 'D' | 'E'): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const value: string = c.value as string;

      if (!value) {
        return null;
      }

      const allowedCharacters = Validation.getAllowedCharactersByType(datentyp);
      const nonDinNormChars = Validation.getNonDinNormChars(value, allowedCharacters);

      return nonDinNormChars.length > 0 ? {DIN91379ERROR: true} : null;
    };
  }

  /**
   * Identifies and returns an array of characters from the input string `value` that do not conform to the DIN norm.
   * The function checks each character and its potential diacritics against the allowed characters and diacritics
   * specified in the `allowedCharacters` parameter.
   * @param value - The input string to be validated.
   * @param allowedCharacters - An object containing the allowed characters as per DIN norms.
   * @returns An array of characters from the input string that are not allowed by DIN norms.
   */
  private static getNonDinNormChars(value: string, allowedCharacters: AllowedSigns): string[] {
    const nonDinNormChars = [];
    const SINGLE_STEP = 1;
    const DIACRITIC_STEP = 2;

    for (let i = 0; i < value.length; ) {
      const {unicodeCharacter, step} = this.processCharacter(value, i, allowedCharacters, SINGLE_STEP, DIACRITIC_STEP);
      if (unicodeCharacter) {
        nonDinNormChars.push(unicodeCharacter);
      }
      i += step;
    }
    return nonDinNormChars;
  }

  /**
   * Processes a character from the given string value at the specified index.
   * Determines if the character is allowed based on the provided allowed characters.
   * If the character is allowed, it processes it accordingly; otherwise, it returns the character itself.
   * @param value - The string value containing the character to process.
   * @param index - The index of the character in the string value.
   * @param allowedCharacters - An object containing the allowed characters.
   * @param SINGLE_STEP - The step value to use for single characters.
   * @param DIACRITIC_STEP - The step value to use for diacritic characters.
   * @returns An object containing the processed unicode character and the step value.
   */
  private static processCharacter(
    value: string,
    index: number,
    allowedCharacters: AllowedSigns,
    SINGLE_STEP: number,
    DIACRITIC_STEP: number
  ): {unicodeCharacter: string | null; step: number} {
    const unicodeCharacter = 'U+' + Validation.getHexCodePoint(value, index);
    const step = SINGLE_STEP;

    if (allowedCharacters.allowed.hasOwnProperty(unicodeCharacter)) {
      return this.processAllowedCharacter(value, index, allowedCharacters, SINGLE_STEP, DIACRITIC_STEP);
    } else {
      return {unicodeCharacter: value.charAt(index), step};
    }
  }

  /**
   * Processes a character at a given index in a string to determine if it is an allowed character,
   * including handling diacritic characters.
   * @param value - The string containing the character to process.
   * @param index - The index of the character in the string to process.
   * @param allowedCharacters - An object containing sets of allowed characters and diacritic characters.
   * @param SINGLE_STEP - The step size for a single character.
   * @param DIACRITIC_STEP - The step size for a diacritic character.
   * @returns An object containing the Unicode representation of the character and the step size.
   */
  private static processAllowedCharacter(
    value: string,
    index: number,
    allowedCharacters: AllowedSigns,
    SINGLE_STEP: number,
    DIACRITIC_STEP: number
  ): {unicodeCharacter: string | null; step: number} {
    let unicodeCharacter = 'U+' + Validation.getHexCodePoint(value, index);
    const step = SINGLE_STEP;

    if (
      index + SINGLE_STEP < value.length &&
      allowedCharacters.diacritic?.hasOwnProperty('U+' + Validation.getHexCodePoint(value, index + SINGLE_STEP))
    ) {
      const hasAdditionalDiacritic = Validation.hasAdditionalDiacritic(value, index, DIACRITIC_STEP, allowedCharacters);
      const hasAdditionalAllowed = Validation.hasAdditionalAllowed(value, index, DIACRITIC_STEP, allowedCharacters);

      unicodeCharacter += '+' + Validation.getHexCodePoint(value, index + SINGLE_STEP);

      if (hasAdditionalDiacritic || hasAdditionalAllowed) {
        return this.processAdditionalDiacritic(
          value,
          index,
          allowedCharacters,
          unicodeCharacter,
          DIACRITIC_STEP,
          SINGLE_STEP
        );
      } else {
        return this.processSingleDiacritic(value, index, allowedCharacters, unicodeCharacter, SINGLE_STEP);
      }
    }

    return {unicodeCharacter: null, step};
  }

  /**
   * Processes additional diacritic characters in a given string value.
   * @param value - The string value to process.
   * @param index - The current index in the string value.
   * @param allowedCharacters - An object containing allowed characters.
   * @param unicodeCharacter - The current unicode character being processed.
   * @param DIACRITIC_STEP - The step size for diacritic characters.
   * @param SINGLE_STEP - The step size for single characters.
   * @returns An object containing the combined unicode character (if any) and the step size.
   */
  private static processAdditionalDiacritic(
    value: string,
    index: number,
    allowedCharacters: AllowedSigns,
    unicodeCharacter: string,
    DIACRITIC_STEP: number,
    SINGLE_STEP: number
  ): {unicodeCharacter: string | null; step: number} {
    if (
      !allowedCharacters.allowed.hasOwnProperty(
        unicodeCharacter + '+' + Validation.getHexCodePoint(value, index + DIACRITIC_STEP)
      )
    ) {
      const combinedChar =
        value.charAt(index) + value.charAt(index + SINGLE_STEP) + value.charAt(index + DIACRITIC_STEP);
      return {unicodeCharacter: combinedChar, step: DIACRITIC_STEP + SINGLE_STEP};
    }
    return {unicodeCharacter: null, step: DIACRITIC_STEP + SINGLE_STEP};
  }

  /**
   * Processes a single diacritic character in a string.
   * @param value - The string value being processed.
   * @param index - The current index in the string.
   * @param allowedCharacters - An object containing allowed characters.
   * @param unicodeCharacter - The current unicode character being processed.
   * @param SINGLE_STEP - The step size for processing characters.
   * @returns An object containing the combined unicode character (if not allowed) and the step size.
   */
  private static processSingleDiacritic(
    value: string,
    index: number,
    allowedCharacters: AllowedSigns,
    unicodeCharacter: string,
    SINGLE_STEP: number
  ): {unicodeCharacter: string | null; step: number} {
    if (!allowedCharacters.allowed.hasOwnProperty(unicodeCharacter)) {
      const combinedChar = value.charAt(index) + value.charAt(index + SINGLE_STEP);
      return {unicodeCharacter: combinedChar, step: SINGLE_STEP + SINGLE_STEP};
    }
    return {unicodeCharacter: null, step: SINGLE_STEP + SINGLE_STEP};
  }

  /**
   * Checks if the character at the specified index in the given string has an additional diacritic.
   * @param value - The string to check for additional diacritics.
   * @param index - The index of the character in the string to check.
   * @param additionalDiacriticIndex - The offset index to check for an additional diacritic.
   * @param allowedCharacters - An object containing allowed characters and their diacritics.
   * @returns `true` if the character at the specified index has an additional diacritic; otherwise, `false`.
   */
  private static hasAdditionalDiacritic(
    value: string,
    index: number,
    additionalDiacriticIndex: number,
    allowedCharacters: AllowedSigns
  ): boolean {
    return (
      index + additionalDiacriticIndex < value.length &&
      !!allowedCharacters.diacritic?.hasOwnProperty(
        'U+' + Validation.getHexCodePoint(value, index + additionalDiacriticIndex)
      )
    );
  }

  /**
   * Checks if the character at the specified index in the given string has an additional allowed diacritic.
   * @param value - The string to be checked.
   * @param index - The current index of the character in the string.
   * @param additionalDiacriticIndex - The index offset for the additional diacritic.
   * @param allowedCharacters - An object containing allowed characters.
   * @returns `true` if the character at the specified index has an additional allowed diacritic, otherwise `false`.
   */
  private static hasAdditionalAllowed(
    value: string,
    index: number,
    additionalDiacriticIndex: number,
    allowedCharacters: AllowedSigns
  ): boolean {
    const nextCharIndex = 1;

    return (
      index + additionalDiacriticIndex < value.length &&
      Validation.getHexCodePoint(value, index + nextCharIndex) == '035F' &&
      allowedCharacters.allowed.hasOwnProperty(
        'U+' + Validation.getHexCodePoint(value, index + additionalDiacriticIndex)
      )
    );
  }

  /**
   * Returns the allowed characters based on the specified type.
   * @param datentyp - The type of data for which allowed characters are to be retrieved.
   *                   It can be one of the following values:
   *                   - 'A': Includes latein and n1 characters.
   *                   - 'B': Includes latein, n1, and n2 characters.
   *                   - 'C': Includes latein, n1, n2, n3, and n4 characters.
   *                   - 'D': Includes latein, n1, n2, n3, n4, e1, and eGriech characters.
   *                   - 'E': Includes latein, n1, n2, n3, n4, e1, eGriech, and eKyrill characters.
   * @returns An object containing the allowed characters and diacritic characters for the specified type.
   */
  static getAllowedCharactersByType(datentyp: 'A' | 'B' | 'C' | 'D' | 'E'): AllowedSigns {
    switch (datentyp) {
      case 'A':
        return Validation.mergeObjects(dinNorm91379Characters.latein, dinNorm91379Characters.n1);
      case 'B':
        return Validation.mergeObjects(
          dinNorm91379Characters.latein,
          dinNorm91379Characters.n1,
          dinNorm91379Characters.n2
        );
      case 'C':
        return Validation.mergeObjects(
          dinNorm91379Characters.latein,
          dinNorm91379Characters.n1,
          dinNorm91379Characters.n2,
          dinNorm91379Characters.n3,
          dinNorm91379Characters.n4
        );
      case 'D':
        return Validation.mergeObjects(
          dinNorm91379Characters.latein,
          dinNorm91379Characters.n1,
          dinNorm91379Characters.n2,
          dinNorm91379Characters.n3,
          dinNorm91379Characters.n4,
          dinNorm91379Characters.e1,
          dinNorm91379Characters.eGriech
        );
      case 'E':
        return Validation.mergeObjects(
          dinNorm91379Characters.latein,
          dinNorm91379Characters.n1,
          dinNorm91379Characters.n2,
          dinNorm91379Characters.n3,
          dinNorm91379Characters.n4,
          dinNorm91379Characters.e1,
          dinNorm91379Characters.eGriech,
          dinNorm91379Characters.eKyrill
        );
      default:
        return {allowed: {}, diacritic: {}};
    }
  }

  /**
   * Converts the Unicode code point of a character at a specified index in a string to a hexadecimal string.
   * If the input is not a string or the index is out of bounds, returns '0000'.
   * @param input - The string from which to get the Unicode code point.
   * @param index - The index of the character in the string.
   * @returns The hexadecimal string representation of the Unicode code point, padded to 4 characters.
   */
  static getHexCodePoint(input: string, index: number): string {
    if (!input || typeof input !== 'string') {
      return '0000';
    }

    const code = input.charCodeAt(index);
    const hexBase = 16;
    const hexStringLength = 4;

    return isNaN(code) ? '0000' : code.toString(hexBase).toUpperCase().padStart(hexStringLength, '0');
  }

  /**
   * Merges multiple `AllowedSigns` objects into a single `AllowedSigns` object.
   * @param objects - The `AllowedSigns` objects to merge.
   * @returns The merged `AllowedSigns` object containing combined `allowed` and `diacritic` properties.
   */
  private static mergeObjects(...objects: AllowedSigns[]): AllowedSigns {
    const mergedAllowed: {[key: string]: boolean} = {};
    const mergedDiactric: {[key: string]: boolean} = {};

    objects.forEach((obj) => {
      Object.assign(mergedAllowed, obj.allowed);
      Object.assign(mergedDiactric, obj.diacritic);
    });

    return {allowed: mergedAllowed, diacritic: mergedDiactric};
  }
}
