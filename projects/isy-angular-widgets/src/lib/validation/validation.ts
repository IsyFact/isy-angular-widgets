import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {parseISO, isValid, isBefore, startOfDay, parse, isAfter, format} from 'date-fns';
import {DATE_FORMATS_LIST, INPUT_MASK_REGEX, INPUT_UNSPECIFIED_REGEX} from './data/date-formats';

/**
 * List of user-defined validators. Can be extended with additional static validators
 */
export class Validation {
  /**
   * If the specified value is a valid date, it will be checked if the date is in the future.
   * If the date corresponds to today's date or is in the past, a "FUTURE" error is thrown.
   * For invalid dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {FUTURE: true} if the validation fails; null otherwise
   */
  static isInFuture(c: AbstractControl): ValidationErrors | null {
    const input = (c.value as string) ?? null;

    if (!input) return null;

    const today = startOfDay(new Date());
    let parsedDate: Date;
    parsedDate = parseISO(input);

    if (isNaN(parsedDate.getTime())) {
      const formatsToTry = DATE_FORMATS_LIST;

      for (const format of formatsToTry) {
        parsedDate = parse(input, format, new Date());
        if (!isNaN(parsedDate.getTime())) {
          break;
        }
      }
    }

    if (isValid(parsedDate) && isBefore(parsedDate, today)) {
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
  static isInPast(c: AbstractControl): ValidationErrors | null {
    const input = (c.value as string) ?? null;

    if (!input) return null;

    const today = startOfDay(new Date());
    let parsedDate: Date;
    parsedDate = parseISO(input);

    if (isNaN(parsedDate.getTime())) {
      const formatsToTry = DATE_FORMATS_LIST;

      for (const format of formatsToTry) {
        parsedDate = parse(input, format, new Date());
        if (!isNaN(parsedDate.getTime())) {
          break;
        }
      }
    }

    if (isValid(parsedDate) && isAfter(parsedDate, today)) {
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
   * @returns The object {UNSPECIFIEDDATE: true} if the validation fails; null otherwise
   */
  static validUnspecifiedDate(c: AbstractControl): ValidationErrors | null {
    const input = c.value as string;

    if (!input) return null;

    const regexInputMask = INPUT_MASK_REGEX;
    let isDateValid = false;

    if (input.match(regexInputMask)) {
      const [day, month, year] = input.split('.');

      if (!(input.match('x') !== null || `${day}` === '00' || `${month}` === '00')) {
        const isoFormattedStr = `${year}-${month}-${day}`;
        const date = new Date(isoFormattedStr);
        const timestamp = date.getTime();

        if (!isNaN(timestamp)) isDateValid = date.toISOString().startsWith(isoFormattedStr);
      }
    }

    const regexInputUnspecified = INPUT_UNSPECIFIED_REGEX;

    if (!(input.match(regexInputUnspecified) !== null || isDateValid)) return {UNSPECIFIEDDATE: true};

    return null;
  }

  /**
   * Checks that the date is a valid date. To be used as a factory that returns a validator function.
   * @param dateFormat The format to be checked.
   * @param messageKey Key of the validator message
   * @param strict Strict parsing means that an exact match is required - including delimiters, whitespaces, etc.
   * @returns A validator function with the given configuration
   */
  static dateFormat(dateFormat: string, messageKey: string, strict: boolean = false): ValidatorFn {
    return (c: AbstractControl<string>): ValidationErrors | null => {
      const input = c.value ?? null;

      if (!input) return null;

      let parsedDate: Date;
      let isValidDate = false;
      const isoTimeLength = 8;

      switch (dateFormat) {
        case 'ISO8601':
          parsedDate = parseISO(input);
          isValidDate = isValid(parsedDate);
          break;
        case 'ISOTime':
          const completeDateString = `2023-01-01 ${input}`;
          parsedDate = parse(completeDateString, 'yyyy-MM-dd HH:mm:ss', new Date());
          isValidDate = strict ? isValid(parsedDate) && input.length === isoTimeLength : isValid(parsedDate);
          break;
        default:
          parsedDate = parse(input, dateFormat, new Date());
          isValidDate = strict ? isValid(parsedDate) && format(parsedDate, dateFormat) === input : isValid(parsedDate);
          break;
      }

      if (!isValidDate) return {[messageKey]: {format: dateFormat}};

      return null;
    };
  }

  /**
   * Checks if the date is a valid date in ISO 8601 format.
   * @param c The control element the validator is appended to
   * @returns The object {DATE: true} if the validation fails; null otherwise
   */
  static isoDate(c: AbstractControl): ValidationErrors | null {
    const isoDateValidatorFn: ValidatorFn = Validation.dateFormat('yyyy-MM-dd', 'DATE', true);
    return isoDateValidatorFn(c);
  }

  /**
   * Checks if it is a valid time in ISO 8601 format.
   * @param c The control element the validator is appended to
   * @returns The object {TIME: true} if the validation fails; null otherwise
   */
  static isoTime(c: AbstractControl): ValidationErrors | null {
    const isoTimeValidatorFn: ValidatorFn = Validation.dateFormat('ISOTime', 'TIME', true);
    return isoTimeValidatorFn(c);
  }

  /**
   * Checks if the value of the control contains a valid date in ISO format.
   * @param c The control element the validator is appended to
   * @returns The object {DATETIME: true} if the validation fails; null otherwise
   */
  static isoDateTime(c: AbstractControl): ValidationErrors | null {
    const isoDateTimeValidatorFn: ValidatorFn = Validation.dateFormat('ISO8601', 'DATETIME', true);
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
}
