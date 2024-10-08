import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import moment, {MomentInput} from 'moment';
import {
  INPUT_MASK_REGEX,
  INPUT_MASK_REGEX_ISO_DATE,
  INPUT_UNSPECIFIED_REGEX,
  INPUT_UNSPECIFIED_REGEX_ISO_DATE
} from './data/date-formats';

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
}
