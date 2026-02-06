import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {
  INPUT_MASK_REGEX,
  INPUT_MASK_REGEX_ISO_DATE,
  INPUT_UNSPECIFIED_REGEX,
  INPUT_UNSPECIFIED_REGEX_ISO_DATE
} from './data/date-formats';
import {din91379Characters} from './data/din-91379-characters';
import {AllowedSigns} from './model/din-91379';

/**
 * List of user-defined validators. Can be extended with additional static validators
 */
export class Validation {
  /**
   * Returns a new Date at the start of the day (00:00:00.000) in local time.
   */
  private static startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Returns a new Date at the start of the month (day 1, 00:00:00.000) in local time.
   */
  private static startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Validates a (year, month, day) triple and returns a local Date at 00:00 if valid.
   */
  private static toLocalDate(year: number, month: number, day: number): Date | null {
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Parses a date value for validators that previously accepted MomentInput.
   * Supports Date, ISO date-time strings, and common date-only formats used in this library.
   * Returns null if the input cannot be parsed to a valid Date.
   */
  private static parseDateValue(value: unknown): Date | null {
    if (value == null || value === '') return null;

    // Date instance
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    // Backward-compatibility: moment-like objects that expose toDate()
    if (typeof value === 'object' && value !== null && typeof (value as any).toDate === 'function') {
      const d = (value as any).toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d;
    }

    // Timestamp
    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value !== 'string') return null;
    const input = value.trim();
    if (!input) return null;

    // ISO 8601 date-time with timezone (e.g. 1997-01-01T09:28:00Z / +01:00)
    const isoDateTimeRegex =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
    if (isoDateTimeRegex.test(input)) {
      const d = new Date(input);
      return isNaN(d.getTime()) ? null : d;
    }

    // ISO date-only: YYYY-MM-DD
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      return Validation.toLocalDate(year, month, day);
    }

    // German: DD.MM.YYYY
    m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(input);
    if (m) {
      const day = Number(m[1]);
      const month = Number(m[2]);
      const year = Number(m[3]);
      return Validation.toLocalDate(year, month, day);
    }

    // Hyphenated: DD-MM-YYYY OR MM-DD-YYYY (try both, like moment with multiple formats)
    m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(input);
    if (m) {
      const a = Number(m[1]);
      const b = Number(m[2]);
      const year = Number(m[3]);

      // Try DD-MM-YYYY first
      const asDdMm = Validation.toLocalDate(year, b, a);
      if (asDdMm) return asDdMm;

      // Fallback to MM-DD-YYYY - could potentially cause the date to be parsed differently as expected. Not sure if this is a great idea. (Example: MM-DD-YYYY for 01-02-2000 would be interpreted above, as 1. February 2000 and not 2. January 2000)
      const asMmDd = Validation.toLocalDate(year, a, b);
      if (asMmDd) return asMmDd;
    }

    // As a last resort, try native parsing for other ISO-like strings
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Validates an input string against a limited set of moment-like format tokens used by this library.
   * This replaces moment(input, format, strict).isValid().
   */
  private static isValidByFormat(input: string, format: string, strict: boolean): boolean {
    const value = (input ?? '').toString().trim();
    if (!value) return false;

    // Special-case: DD.MM.YYYY with non-strict parsing should allow partial input like "1.1." or "1.1.1"
    if (format === 'DD.MM.YYYY' && !strict) {
      const m = /^(\d{1,2})\.(\d{1,2})\.(\d{0,4})$/.exec(value);
      if (!m) return false;
      const day = Number(m[1]);
      const month = Number(m[2]);
      const yearStr = m[3] ?? '';
      const year = yearStr.length ? Number(yearStr.padStart(4, '0')) : new Date().getFullYear();
      return Validation.toLocalDate(year, month, day) !== null;
    }

    // YYYY-MM-DD
    if (format === 'YYYY-MM-DD') {
      const m = (strict ? /^(\d{4})-(\d{2})-(\d{2})$/ : /^(\d{4})-(\d{1,2})-(\d{1,2})$/).exec(value);
      if (!m) return false;
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      return Validation.toLocalDate(year, month, day) !== null;
    }

    // DD.MM.YYYY (strict)
    if (format === 'DD.MM.YYYY') {
      const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
      if (!m) return false;
      const day = Number(m[1]);
      const month = Number(m[2]);
      const year = Number(m[3]);
      return Validation.toLocalDate(year, month, day) !== null;
    }

    // HH:mm:ss
    if (format === 'HH:mm:ss') {
      const m = (strict ? /^(\d{2}):(\d{2}):(\d{2})$/ : /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/).exec(value);
      if (!m) return false;
      const hh = Number(m[1]);
      const mm = Number(m[2]);
      const ss = Number(m[3]);
      return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59 && ss >= 0 && ss <= 59;
    }

    // YYYY-MM-DDTHH:mm:ss[Z] (literal Z at the end)
    if (format === 'YYYY-MM-DDTHH:mm:ss[Z]') {
      const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.exec(value);
      if (!m) return false;
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      const hh = Number(m[4]);
      const mm = Number(m[5]);
      const ss = Number(m[6]);
      if (Validation.toLocalDate(year, month, day) === null) return false;
      return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59 && ss >= 0 && ss <= 59;
    }

    // MM/YY (credit card expiration)
    if (format === 'MM/YY') {
      const m = /^(\d{2})\/(\d{2})$/.exec(value);
      if (!m) return false;
      const month = Number(m[1]);
      const year2 = Number(m[2]);
      return month >= 1 && month <= 12 && year2 >= 0 && year2 <= 99;
    }

    // Fallback: for unknown formats, do not guess in strict mode.
    if (strict) return false;

    // Non-strict fallback: accept anything that can be parsed by native Date.
    const d = new Date(value);
    return !isNaN(d.getTime());
  }


  /**
   * If the specified value is a valid date, it will be checked if the date is in the future.
   * If the date corresponds to today's date or is in the past, a "INVALIDFUTUREDATE" error is thrown.
   * For invalid dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {INVALIDFUTUREDATE: true} if the validation fails; null otherwise
   */
  static isInFuture(c: AbstractControl<any>): ValidationErrors | null {
    const today = Validation.startOfDay(new Date());
    const dateValue = Validation.parseDateValue(c.value);

    if (dateValue && dateValue.getTime() <= today.getTime()) {
      return {INVALIDFUTUREDATE: true};
    }

    return null;
  }

  /**
   * If the given value is a valid date, it will be checked if the date is in the past.
   * If the date is today's date or is in the future, a "INVALIDPASTDATE" error is thrown.
   * For invalid dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {INVALIDPASTDATE: true} if the validation fails; null otherwise
   */
  static isInPast(c: AbstractControl<any>): ValidationErrors | null {
    const today = Validation.startOfDay(new Date());
    const dateValue = Validation.parseDateValue(c.value);

    if (dateValue && dateValue.getTime() >= today.getTime()) {
      return {INVALIDPASTDATE: true};
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
   * @returns The object {INVALIDUNSPECIFIEDDATE: true} if the validation fails; null otherwise
   */
  static validUnspecifiedDate(c: AbstractControl, allowZeroFormat?: boolean): ValidationErrors | null {
    const input = (c.value as string) ?? null;

    if (!input) return null;

    let isDateValid = false;

    if (INPUT_MASK_REGEX.test(input)) {
      const [day, month, year] = input.split('.');
      const isoFormattedStr = `${year}-${month}-${day}`;

      if (year === '0000' && !allowZeroFormat) return {INVALIDUNSPECIFIEDDATE: true};

      if (!(input.includes('x') || day === '00' || month === '00')) {
        const date = new Date(isoFormattedStr);
        const timestamp = date.getTime();

        if (!isNaN(timestamp)) isDateValid = date.toISOString().startsWith(isoFormattedStr);
      }
    }

    if (!(INPUT_UNSPECIFIED_REGEX.test(input) || isDateValid)) return {INVALIDUNSPECIFIEDDATE: true};

    return null;
  }

  /**
   * Checks that the date is a valid unspecified date or valid date in ISO 8601 format YYYY-MM-DD.
   * If the date in ISO 8601 format is not valid and not unspecified, a "DATE" error is thrown.
   * E.g. unspecified dates: YYYY-MM-00, YYYY-00-00, 0000-00-00, YYYY-MM-xx, YYYY-xx-xx, xxxx-xx-xx
   * For valid or valid unspecified dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @param allowZeroFormat If true, the zero date format should allowed
   * @returns The object {INVALIDUNSPECIFIEDISODATE: true} if the validation fails; null otherwise
   */
  static validUnspecifiedISODate(c: AbstractControl, allowZeroFormat = false): ValidationErrors | null {
    const input = (c.value as string) ?? null;

    if (!input) return null;

    let isDateValid = false;

    if (INPUT_MASK_REGEX_ISO_DATE.test(input)) {
      const [year, month, day] = input.split('-');
      const isoFormattedStr = `${year}-${month}-${day}`;

      if (year === '0000' && !allowZeroFormat) return {INVALIDUNSPECIFIEDISODATE: true};

      if (!(input.includes('x') || day === '00' || month === '00')) {
        const date = new Date(isoFormattedStr);
        const timestamp = date.getTime();

        if (!isNaN(timestamp)) isDateValid = date.toISOString().startsWith(isoFormattedStr);
      }
    }

    if (!(INPUT_UNSPECIFIED_REGEX_ISO_DATE.test(input) || isDateValid)) return {INVALIDUNSPECIFIEDISODATE: true};

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
    return (c: AbstractControl<any>): ValidationErrors | null => {
      const input = c.value ?? null;
      if (!input) {
        return null;
      }

      // If a Date (or moment-like) is provided, treat it as a valid date value.
      if (input instanceof Date) {
        return isNaN(input.getTime()) ? {[messageKey]: {format: dateFormat}} : null;
      }
      if (typeof input === 'object' && input !== null && typeof (input as any).toDate === 'function') {
        const d = (input as any).toDate();
        if (d instanceof Date) {
          return isNaN(d.getTime()) ? {[messageKey]: {format: dateFormat}} : null;
        }
      }

      const inputStr = typeof input === 'string' ? input : String(input);
      const isValid = Validation.isValidByFormat(inputStr, dateFormat, strict);

      if (!dateFormat || !isValid) {
        return {[messageKey]: {format: dateFormat}};
      }

      return null;
    };
  }

  /**
   * Checks if the date is a valid credit card expiration date. The date must be in the future.
   * If the date is not a valid credit card expiration date, a "INVALIDCREDITCARDEXPIRATIONDATE" error is thrown.
   * For valid credit card expiration dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {INVALIDCREDITCARDEXPIRATIONDATE: true} if the validation fails; null otherwise
   */
  static validCreditCardExpirationDate(c: AbstractControl<any>): ValidationErrors | null {
    const today = Validation.startOfMonth(new Date());
    const input = (c.value as string) ?? '';

    if (input === '') {
      return null;
    }

    // Strictly validate "MM/YY"
    if (!Validation.isValidByFormat(input, 'MM/YY', true)) {
      return {INVALIDCREDITCARDEXPIRATIONDATE: true};
    }

    // Extract date values
    const match = /^(\d{2})\/(\d{2})$/.exec(input);
    if (!match) {
      return {INVALIDCREDITCARDEXPIRATIONDATE: true};
    }

    const month = Number(match[1]);
    const year2 = Number(match[2]);

    // Moment's "YY" parsing maps to a 4-digit year; we follow the common 2000-2099 mapping.
    const year = 2000 + year2;

    const expDate = new Date(year, month - 1, 1);
    expDate.setHours(0, 0, 0, 0);

    if (isNaN(expDate.getTime()) || expDate.getTime() < today.getTime()) {
      return {INVALIDCREDITCARDEXPIRATIONDATE: true};
    }
    return null;
  }

  /**
   * Checks if the date is a valid date in ISO 8601 format.
   * @param c The control element the validator is appended to
   * @returns The object {DATE: true} if the validation fails; null otherwise
   */
  static isoDate(c: AbstractControl): ValidationErrors | null {
    const isoDateValidatorFn: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'INVALIDISODATE');
    return isoDateValidatorFn(c);
  }

  /**
   * Checks if it is a valid time in ISO 8601 format.
   * @param c The control element the validator is appended to
   * @returns The object {TIME: true} if the validation fails; null otherwise
   */
  static isoTime(c: AbstractControl): ValidationErrors | null {
    const isoTimeValidatorFn: ValidatorFn = Validation.dateFormat('HH:mm:ss', true, 'INVALIDISOTIME');
    return isoTimeValidatorFn(c);
  }

  /**
   * Checks if the value of the control contains a valid date in ISO format.
   * @param c The control element the validator is appended to
   * @returns The object {DATETIME: true} if the validation fails; null otherwise
   */
  static isoDateTime(c: AbstractControl): ValidationErrors | null {
    const isoDateTimeValidatorFn: ValidatorFn = Validation.dateFormat(
      'YYYY-MM-DDTHH:mm:ss[Z]',
      true,
      'INVALIDISODATETIME'
    );
    return isoDateTimeValidatorFn(c);
  }

  /**
   * Checks the entry to see if it is a valid credit card number. This is checked:
   * - If input contains characters other than numbers, spaces, hyphens, an error is returned.
   * - If the input is shorter than 12 characters or longer than 19 characters, an error is returned
   * - Luhn algorithm is applied to the input, if the result is NOT modulo 10, an error is returned.
   * @param c The control element the validator is appended to
   * @returns The object {INVALIDCREDITCARDNUMBER: true} if the validation fails; null otherwise
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
      return {INVALIDCREDITCARDNUMBER: true};
    }

    if (value.length > maxLength || value.length < minLength) {
      return {INVALIDCREDITCARDNUMBER: true};
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
      return {INVALIDCREDITCARDNUMBER: true};
    }

    return null;
  }

  /**
   * Validates a string based on the DIN 91379 standard for the specified data type.
   * @param dataType - The type of data to validate. It can be one of the following:
   *   - 'A': Type A
   *   - 'B': Type B
   *   - 'C': Type C
   *   - 'D': Type D
   *   - 'E': Type E
   * @returns A ValidatorFn that takes an AbstractControl and returns a ValidationErrors object
   * if the control's value contains characters not allowed by the DIN 91379 standard for the specified data type
   * or null if the value is valid or empty.
   */
  static validateDIN91379(dataType: 'A' | 'B' | 'C' | 'D' | 'E'): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const value: string = c.value as string;

      if (!value) {
        return null;
      }

      const allowedCharacters = Validation.getAllowedCharactersByType(dataType);
      const nonDinChars = Validation.getNonDinChars(value, allowedCharacters);

      return nonDinChars.length > 0 ? {DIN91379ERROR: true} : null;
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
  private static getNonDinChars(value: string, allowedCharacters: AllowedSigns): string[] {
    const nonDinChars = [];
    const SINGLE_STEP = 1;
    const DIACRITIC_STEP = 2;

    for (let i = 0; i < value.length; ) {
      const {unicodeCharacter, step} = this.processCharacter(value, i, allowedCharacters, SINGLE_STEP, DIACRITIC_STEP);
      if (unicodeCharacter) {
        nonDinChars.push(unicodeCharacter);
      }
      i += step;
    }
    return nonDinChars;
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
    const unicodeCharacter = `U+${Validation.getHexCodePoint(value, index)}`;
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
    let unicodeCharacter = `U+${Validation.getHexCodePoint(value, index)}`;
    const step = SINGLE_STEP;

    if (
      index + SINGLE_STEP < value.length &&
      allowedCharacters.diacritic?.hasOwnProperty(`U+${Validation.getHexCodePoint(value, index + SINGLE_STEP)}`)
    ) {
      const hasAdditionalDiacritic = Validation.hasAdditionalDiacritic(value, index, DIACRITIC_STEP, allowedCharacters);
      const hasAdditionalAllowed = Validation.hasAdditionalAllowed(value, index, DIACRITIC_STEP, allowedCharacters);

      unicodeCharacter += `+${Validation.getHexCodePoint(value, index + SINGLE_STEP)}`;

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
        `${unicodeCharacter}+${Validation.getHexCodePoint(value, index + DIACRITIC_STEP)}`
      )
    ) {
      const combinedChar = `${value.charAt(index)}${value.charAt(index + SINGLE_STEP)}${value.charAt(index + DIACRITIC_STEP)}`;
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
      const combinedChar = `${value.charAt(index)}${value.charAt(index + SINGLE_STEP)}`;
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
        `U+${Validation.getHexCodePoint(value, index + additionalDiacriticIndex)}`
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
    const SINGLE_STEP = 1;

    return (
      index + additionalDiacriticIndex < value.length &&
      Validation.getHexCodePoint(value, index + SINGLE_STEP) === '035F' &&
      allowedCharacters.allowed.hasOwnProperty(
        `U+${Validation.getHexCodePoint(value, index + additionalDiacriticIndex)}`
      )
    );
  }

  /**
   * Returns the allowed characters based on the specified type.
   * @param dataType - The type of data for which allowed characters are to be retrieved.
   *                   It can be one of the following values:
   *                   - 'A': Includes latin and n1 characters.
   *                   - 'B': Includes latin, n1, and n2 characters.
   *                   - 'C': Includes latin, n1, n2, n3, and n4 characters.
   *                   - 'D': Includes latin, n1, n2, n3, n4, e1, and eGreek characters.
   *                   - 'E': Includes latin, n1, n2, n3, n4, e1, eGreek, and eCyrillic characters.
   * @returns An object containing the allowed characters and diacritic characters for the specified type.
   */
  static getAllowedCharactersByType(dataType: 'A' | 'B' | 'C' | 'D' | 'E'): AllowedSigns {
    switch (dataType) {
      case 'A':
        return Validation.mergeObjects(din91379Characters.latin, din91379Characters.n1);
      case 'B':
        return Validation.mergeObjects(din91379Characters.latin, din91379Characters.n1, din91379Characters.n2);
      case 'C':
        return Validation.mergeObjects(
          din91379Characters.latin,
          din91379Characters.n1,
          din91379Characters.n2,
          din91379Characters.n3,
          din91379Characters.n4
        );
      case 'D':
        return Validation.mergeObjects(
          din91379Characters.latin,
          din91379Characters.n1,
          din91379Characters.n2,
          din91379Characters.n3,
          din91379Characters.n4,
          din91379Characters.e1,
          din91379Characters.eGreek
        );
      case 'E':
        return Validation.mergeObjects(
          din91379Characters.latin,
          din91379Characters.n1,
          din91379Characters.n2,
          din91379Characters.n3,
          din91379Characters.n4,
          din91379Characters.e1,
          din91379Characters.eGreek,
          din91379Characters.eCyrillic
        );
      default:
        return {allowed: {}, diacritic: {}};
    }
  }

  /**
   * Converts the Unicode code point at the specified index in the input string to a hexadecimal string.
   * If the input is null, undefined or not a string, returns '0000'.
   * If the index is out of bounds or the code point is NaN, returns '0000'.
   * @param input - The input string from which to get the code point.
   * @param index - The index of the character in the string to convert to a hexadecimal code point.
   * @returns The hexadecimal representation of the Unicode code point, padded to 4 characters.
   */
  static getHexCodePoint(input: string | null | undefined, index: number): string {
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
    const mergedDiacritic: {[key: string]: boolean} = {};

    objects.forEach((obj) => {
      Object.assign(mergedAllowed, obj.allowed);
      Object.assign(mergedDiacritic, obj.diacritic);
    });

    return {allowed: mergedAllowed, diacritic: mergedDiacritic};
  }
}
