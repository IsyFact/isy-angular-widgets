import {Validation} from './validation';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

interface ToDateCapable {
  toDate: () => Date;
}

/**
 * Expects that error have to be defined
 * @param errors Current errors list
 * @param errorKey Key for error finding
 * @param errorProp Property for error finding
 */
function errorHaveToBeDefined(errors: ValidationErrors | null, errorKey?: string, errorProp?: string): void {
  if (!errors) {
    throw new Error('errors is not defined');
  }

  if (errorKey) {
    expect(errors[errorKey]).toBeDefined();
  }

  if (errorProp) {
    expect(errors[errorProp]).toBeDefined();
  }
}

/**
 * Returns a copy of the date normalized to local start of day.
 * @param date Source date.
 * @returns Date at 00:00:00.000 local time.
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Adds a number of days to a date and returns a new Date instance.
 * @param date Source date.
 * @param days Number of days to add.
 * @returns Shifted date.
 */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Adds a number of years to a date and returns a new Date instance.
 * @param date Source date.
 * @param years Number of years to add.
 * @returns Shifted date.
 */
function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * Formats a date as credit-card expiration string in MM/YY.
 * @param date Source date.
 * @returns Formatted month/year.
 */
function formatMMYY(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear() % 100).padStart(2, '0');
  return `${mm}/${yy}`;
}

/**
 * Formats a date as ISO date-only string in local time: YYYY-MM-DD
 * @param date Source date.
 * @returns ISO date-only string (local).
 */
function formatYYYYMMDDLocal(date: Date): string {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a date as German date string in local time: DD.MM.YYYY
 * @param date Source date.
 * @returns German date string (local).
 */
function formatDDMMYYYYLocal(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Formats a date as hyphen date string in local time: DD-MM-YYYY
 * @param date Source date.
 * @returns Hyphen date string (local).
 */
function formatDDMMYYYYHyphenLocal(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Creates a "moment-like" object exposing toDate() (for backward compatibility paths).
 * @param date Source date.
 * @returns Object exposing toDate().
 */
function momentLike(date: Date): ToDateCapable {
  return {
    toDate: (): Date => new Date(date)
  };
}

/**
 * Unit-Test der IsyValidators Klasse.
 */
describe('Unit Test: Validation', () => {
  describe('unspecifiedDate when input is valid', () => {
    const errorKey = 'INVALIDUNSPECIFIEDDATE';
    let control: AbstractControl;

    beforeEach(() => {
      control = new FormControl('');
    });

    const validInputs = [
      '',
      '11.11.2023',
      '00.11.2023',
      '00.00.2023',
      '00.00.0000',
      'xx.11.2023',
      'xx.xx.2023',
      'xx.xx.xxxx'
    ];

    validInputs.forEach((input) => {
      it(`should return null for valid input ${input}`, () => {
        control.setValue(input);
        const errors = Validation.validUnspecifiedDate(control, true);
        expect(errors).toBeNull();
      });
    });

    it('should return an error for the input 00.00.0000 when the zero date format is not allowed', () => {
      control.setValue('00.00.0000');
      const errors = Validation.validUnspecifiedDate(control, false);
      expect(errors).toEqual({[errorKey]: true});
    });
  });

  describe('unspecifiedDate when input is invalid', () => {
    const errorKey = 'INVALIDUNSPECIFIEDDATE';
    let control: AbstractControl;

    beforeEach(() => {
      control = new FormControl('');
    });

    const invalidInputs = [
      {input: '50.11.2023', description: 'invalid day'},
      {input: '01.30.2023', description: 'invalid month'},
      {input: '00.13.2023', description: 'invalid month in unspecified date format 00.MM.YYYY'},
      {input: '01.00.2023', description: 'unspecified month in german date format DD.00.YYYY'},
      {input: 'xx.13.2023', description: 'invalid month in unspecified date format xx.MM.YYYY'},
      {input: '01.xx.2023', description: 'unspecified month in german date format DD.xx.YYYY'},
      {input: 'xx.01.xxxx', description: 'unspecified year in german date format xx.MM.xxxx'},
      {input: '01.xx.xxxx', description: 'unspecified month and year in german date format DD.xx.xxxx'},
      {input: '01.01.xxxx', description: 'unspecified year in german date format DD.MM.xxxx'}
    ];

    invalidInputs.forEach(({input, description}) => {
      it(`should return ${errorKey} for ${description}`, () => {
        control.setValue(input);
        const errors = Validation.validUnspecifiedDate(control, true);
        expect(errors).toEqual({[errorKey]: true});
      });
    });
  });

  describe('validUnspecifiedISODate when input is valid', () => {
    const errorKey = 'INVALIDUNSPECIFIEDISODATE';
    let control: AbstractControl;

    beforeEach(() => {
      control = new FormControl('');
    });

    const validInputs = [
      '',
      '2023-11-11',
      '2023-11-00',
      '2023-00-00',
      '0000-00-00',
      '2023-11-xx',
      '2023-xx-xx',
      'xxxx-xx-xx'
    ];

    validInputs.forEach((input) => {
      it(`should return null for '${input}'`, () => {
        control.setValue(input);
        const errors = Validation.validUnspecifiedISODate(control, true);
        expect(errors).toBeNull();
      });
    });

    it('should return an error for the input 0000-00-00 when the zero date format is not allowed', () => {
      control.setValue('0000-00-00');
      const errors = Validation.validUnspecifiedISODate(control, false);
      expect(errors).toEqual({[errorKey]: true});
    });
  });

  describe('validUnspecifiedISODate when input is invalid', () => {
    let control: AbstractControl;
    const errorKey = 'INVALIDUNSPECIFIEDISODATE';

    beforeEach(() => {
      control = new FormControl('');
    });

    const testCases = [
      {input: '2023-11-50', desc: 'invalid day'},
      {input: '2023-30-01', desc: 'invalid month'},
      {input: '2023-13-00', desc: 'invalid month with unspecified day'},
      {input: '2023-13-xx', desc: 'invalid month in unspecified date'},
      {input: '2023-xx-01', desc: 'valid day in unspecified month and year'},
      {input: 'xxxx-01-xx', desc: 'valid month in unspecified year and day'},
      {input: 'xxxx-xx-01', desc: 'valid day in fully unspecified date'},
      {input: 'xxxx-01-01', desc: 'valid date in german format but unspecified year'},
      {input: '2023-00-01', desc: 'valid day and year with unspecified month'}
    ];

    testCases.forEach(({input, desc}) => {
      it(`should return ${errorKey} if ${desc}`, () => {
        control.setValue(input);
        const errors = Validation.validUnspecifiedISODate(control);
        expect(errors).toEqual({[errorKey]: true});
      });
    });
  });

  describe('future', () => {
    it('should return null if date is not valid', () => {
      const control: AbstractControl = new FormControl('abc');
      const errors = Validation.isInFuture(control);
      expect(errors).toBeNull();
    });

    it('should return null if date is in the future', () => {
      const control: AbstractControl = new FormControl(addDays(startOfDay(new Date()), 1));
      const errors = Validation.isInFuture(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDFUTUREDATE if date is in the past', () => {
      const errorKey = 'INVALIDFUTUREDATE';
      const control: AbstractControl = new FormControl(addDays(startOfDay(new Date()), -1));
      const errors = Validation.isInFuture(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });

  describe('past', () => {
    it('should return null if date is not valid', () => {
      const control: AbstractControl = new FormControl('abc');
      const errors = Validation.isInPast(control);
      expect(errors).toBeNull();
    });

    it('should return null if date is in the past', () => {
      const control: AbstractControl = new FormControl(addDays(startOfDay(new Date()), -1));
      const errors = Validation.isInPast(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDPASTDATE if date is in the future', () => {
      const errorKey = 'INVALIDPASTDATE';
      const control: AbstractControl = new FormControl(addDays(startOfDay(new Date()), 1));
      const errors = Validation.isInPast(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });

  describe('dateFormat', () => {
    it('should return no validation error, if input is empty', () => {
      const validDateControl: AbstractControl = new FormControl('');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('DD.MM.YYYY', true, 'DATE');
      const errors = dateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return no validation error, if input is a valid date with required format', () => {
      const validDateControl: AbstractControl = new FormControl('11.11.2017');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('DD.MM.YYYY', true, 'DATE');
      const errors = dateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return no validation error, if input is a valid date after not strict parsing', () => {
      const validDateControl: AbstractControl = new FormControl('1.1.');
      const valideDateValidatorFn: ValidatorFn = Validation.dateFormat('DD.MM.YYYY', false, 'DATE');
      const errors = valideDateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return validation error, if input is not a valid date with required format', () => {
      const invalidDateControl: AbstractControl = new FormControl('1995-1-13');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'DATE');
      const errors = dateValidatorFn(invalidDateControl);
      errorHaveToBeDefined(errors, undefined, 'DATE');
    });

    it('should return validation error, if input is not a valid date after not strict parsing', () => {
      const invalidDateControl: AbstractControl = new FormControl('abc');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', false, 'YEAR');
      const errors = dateValidatorFn(invalidDateControl);
      errorHaveToBeDefined(errors, undefined, 'YEAR');
    });
  });

  describe('validCreditCardExpirationDate', () => {
    it('should return null if the date is in the future', () => {
      const control: AbstractControl = new FormControl(formatMMYY(addYears(new Date(), 1)));
      const errors = Validation.validCreditCardExpirationDate(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDCREDITCARDEXPIRATIONDATE if the date is in the past', () => {
      const errorKey = 'INVALIDCREDITCARDEXPIRATIONDATE';
      const control: AbstractControl = new FormControl(formatMMYY(addYears(new Date(), -1)));
      const errors = Validation.validCreditCardExpirationDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return null if the date is a valid credit card expiration date', () => {
      const actualDate = formatMMYY(new Date());
      const control: AbstractControl = new FormControl(actualDate);
      const errors = Validation.validCreditCardExpirationDate(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDCREDITCARDEXPIRATIONDATE if the date is not a valid credit card expiration date', () => {
      const errorKey = 'INVALIDCREDITCARDEXPIRATIONDATE';
      const control: AbstractControl = new FormControl('13/99');
      const errors = Validation.validCreditCardExpirationDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return null if no value is given', () => {
      const control: AbstractControl = new FormControl('');
      const errors = Validation.validCreditCardExpirationDate(control);
      expect(errors).toBeNull();
    });
  });

  describe('isoDate', () => {
    it('should return no validation error, if input is a valid iso-date', () => {
      const validIsoDateControl: AbstractControl = new FormControl('2018-11-11');
      const errors = Validation.isoDate(validIsoDateControl);
      expect(errors).toBeNull();
    });

    it('should return validation error with key "INVALIDISODATE", if input is not a valid iso-date', () => {
      const invalidIsoDateControl: AbstractControl = new FormControl('12.12.206');
      const errors = Validation.isoDate(invalidIsoDateControl);
      errorHaveToBeDefined(errors, undefined, 'INVALIDISODATE');
    });
  });

  describe('isoTime', () => {
    it('should return no validation error, if input is a valid iso-time', () => {
      const validIsoTimeControl: AbstractControl = new FormControl('12:30:50');
      const errors = Validation.isoTime(validIsoTimeControl);
      expect(errors).toBeNull();
    });

    it('should return validation error with key "INVALIDISOTIME", if input is not a valid iso-time', () => {
      const invalidIsoTimeControl: AbstractControl = new FormControl('45:12:12');
      const errors = Validation.isoTime(invalidIsoTimeControl);
      errorHaveToBeDefined(errors, undefined, 'INVALIDISOTIME');
    });
  });

  describe('isoDateTime', () => {
    it('should return no validation error, if input is a valid iso-dateTime', () => {
      const validIsoDateTimeControl: AbstractControl = new FormControl('1997-01-01T09:28:00Z');
      const errors = Validation.isoDateTime(validIsoDateTimeControl);
      expect(errors).toBeNull();
    });

    it('should return validation error with key "INVALIDISODATETIME", if input is not a valid iso-datetime', () => {
      const invalidIsoDateTimeControl: AbstractControl = new FormControl('1997-01-01T9:28:00');
      const errors = Validation.isoDateTime(invalidIsoDateTimeControl);
      errorHaveToBeDefined(errors, undefined, 'INVALIDISODATETIME');
    });
  });

  describe('creditCardNumber', () => {
    const errorKey = 'INVALIDCREDITCARDNUMBER';

    it('should return null if the number is valid', () => {
      const control: AbstractControl = new FormControl('4485-8456-9196-5929');
      const errors = Validation.validCreditCardNumber(control);
      expect(errors).toBeNull();
    });

    it('should return null if no value is given', () => {
      const control: AbstractControl = new FormControl();
      const errors = Validation.validCreditCardNumber(control);
      expect(errors).toBeNull();
    });

    const invalidCreditCardNumbers = [
      {value: '4485-8456-9196-5928', description: 'invalid checksum'},
      {value: '448s-8456-91g6-5929', description: 'contains non-numeric characters'},
      {value: '4485-8456-9', description: 'too short'},
      {value: '4485-8456-9196-59291', description: 'too long'}
    ];

    invalidCreditCardNumbers.forEach(({value, description}) => {
      it(`should return INVALIDCREDITCARDNUMBER if the value is ${description}`, () => {
        const control: AbstractControl = new FormControl(value);
        const errors = Validation.validCreditCardNumber(control);
        errorHaveToBeDefined(errors, errorKey);
      });
    });
  });

  describe('validateDIN91379', () => {
    // LATIN - with combining diacritical marks
    const LATIN = '\u004D\u0306ĨrmaĽańĽańÛÂÝÂlbertoÝuta\u0043\u0328\u0306';
    const N1 = '\u0020\u0027\u002C\u002D\u002E\u0060\u007E\u00A8\u00B4';
    const N2 = '\u0021\u0022\u0023\u0024\u0025\u0026\u0028\u0029\u002A\u002B';
    const N3 = '\u00A4\u00A6\u00B8\u00BC\u00BD\u00BE';
    const N4 = '\u0009\u000A\u000D\u00A0';
    const E1 = '\u2081';
    const E_GREEK = '\u03BB\u03BC\u03BD\u03BE';
    const E_CYRILLIC = '\u041C\u042E\u0438\u044C';
    const NO_GROUP = '\u0df4';
    const ERROR_KEY = 'DIN91379ERROR';
    const DATA_TYPES = ['A', 'B', 'C', 'D', 'E'];

    DATA_TYPES.forEach((dataType) => {
      it(`should return null when the input is null (for data type ${dataType})`, () => {
        const validator = Validation.validateDIN91379(dataType as 'A' | 'B' | 'C' | 'D' | 'E');
        const control = new FormControl(null);
        const result = validator(control);
        expect(result).toBeNull();
      });
    });

    it('should return null for a valid input (for data type A)', () => {
      const validator = Validation.validateDIN91379('A');
      const control = new FormControl(`${LATIN}${N1}`);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return a validation error for an invalid input (for data type A)', () => {
      const validator = Validation.validateDIN91379('A');
      const control = new FormControl(`${LATIN}${N1}${N2}`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return null for a valid input (for data type B)', () => {
      const validator = Validation.validateDIN91379('B');
      const control = new FormControl(`${LATIN}${N1}${N2}`);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return a validation error for an invalid input (for data type B)', () => {
      const validator = Validation.validateDIN91379('B');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return null for a valid input (for data type C)', () => {
      const validator = Validation.validateDIN91379('C');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}${N4}`);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return a validation error for an invalid input (for data type C)', () => {
      const validator = Validation.validateDIN91379('C');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}${N4}${E1}`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return null for a valid input (for data type D)', () => {
      const validator = Validation.validateDIN91379('D');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}${N4}${E1}${E_GREEK}`);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return a validation error for an invalid input (for data type D)', () => {
      const validator = Validation.validateDIN91379('D');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}${N4}${E1}${E_GREEK}${E_CYRILLIC}`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return null for a valid input (for data type E)', () => {
      const validator = Validation.validateDIN91379('E');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}${N4}${E1}${E_GREEK}${E_CYRILLIC}`);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return a validation error for an invalid input (for data type E)', () => {
      const validator = Validation.validateDIN91379('E');
      const control = new FormControl(`${LATIN}${N1}${N2}${N3}${N4}${E1}${E_GREEK}${E_CYRILLIC}${NO_GROUP}`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return a validation error for an invalid input with one diacritic', () => {
      const validator = Validation.validateDIN91379('A');
      const control = new FormControl(`${LATIN}${N1}\u0043\u030D`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return a validation error for an invalid input with additional allowed character', () => {
      const validator = Validation.validateDIN91379('A');
      const control = new FormControl(`${LATIN}${N1}\u004D\u035F\u0044`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return null for a valid input with two diacritics', () => {
      const validator = Validation.validateDIN91379('A');
      const control = new FormControl(`${LATIN}${N1}\u0043\u0328\u0306`);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return a validation error for an invalid input with two diacritics', () => {
      const validator = Validation.validateDIN91379('A');
      const control = new FormControl(`${LATIN}${N1}\u004D\u0306\u0308`);
      const errors = validator(control);
      errorHaveToBeDefined(errors, ERROR_KEY);
    });

    it('should return empty allowed characters for unknown type', () => {
      const allowedCharacters = Validation.getAllowedCharactersByType('unknown' as 'A' | 'B' | 'C' | 'D' | 'E');
      expect(allowedCharacters).toEqual({allowed: {}, diacritic: {}});
    });

    describe('internal helpers (private) - parseDateValue', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parseDateValue = (Validation as any).parseDateValue as (value: unknown) => Date | null;

      it('should return null for null/empty/unsupported types', () => {
        expect(parseDateValue(null)).toBeNull();
        expect(parseDateValue('')).toBeNull();
        expect(parseDateValue('   ')).toBeNull();
        expect(parseDateValue(true)).toBeNull();
        expect(parseDateValue({})).toBeNull();
        expect(parseDateValue(() => null)).toBeNull();
      });

      it('should accept a native Date instance', () => {
        const d = new Date();
        const parsed = parseDateValue(d);
        expect(parsed).not.toBeNull();
        expect(parsed instanceof Date).toBeTrue();
      });

      it('should return null for Invalid Date instance', () => {
        const d = new Date('not-a-date');
        expect(parseDateValue(d)).toBeNull();
      });

      it('should accept a moment-like object exposing toDate()', () => {
        const d = new Date(2030, 0, 1);
        const parsed = parseDateValue(momentLike(d));
        expect(parsed).not.toBeNull();
        expect(parsed?.getFullYear()).toBe(2030);
        expect(parsed?.getMonth()).toBe(0);
        expect(parsed?.getDate()).toBe(1);
      });

      it('should return null for moment-like object with invalid toDate()', () => {
        const bad: ToDateCapable = {toDate: (): Date => new Date('invalid')};
        expect(parseDateValue(bad)).toBeNull();
      });

      it('should accept a timestamp number', () => {
        const now = Date.now();
        const parsed = parseDateValue(now);
        expect(parsed).not.toBeNull();
        expect(parsed?.getTime()).toBe(now);
      });

      it('should return null for NaN timestamp', () => {
        expect(parseDateValue(Number.NaN)).toBeNull();
      });

      it('should parse ISO date-time with Z/offset (including milliseconds)', () => {
        expect(parseDateValue('1997-01-01T09:28:00Z')).not.toBeNull();
        expect(parseDateValue('1997-01-01T09:28:00.123Z')).not.toBeNull();
        expect(parseDateValue('1997-01-01T09:28:00+01:00')).not.toBeNull();
      });

      it('should parse ISO date-only YYYY-MM-DD as local date', () => {
        const parsed = parseDateValue('2026-02-03');
        expect(parsed).not.toBeNull();
        expect(parsed?.getFullYear()).toBe(2026);
        expect(parsed?.getMonth()).toBe(1);
        expect(parsed?.getDate()).toBe(3);
      });

      it('should parse German date DD.MM.YYYY as local date', () => {
        const parsed = parseDateValue('03.02.2026');
        expect(parsed).not.toBeNull();
        expect(parsed?.getFullYear()).toBe(2026);
        expect(parsed?.getMonth()).toBe(1);
        expect(parsed?.getDate()).toBe(3);
      });

      it('should parse DD-MM-YYYY first when possible', () => {
        const parsed = parseDateValue('31-12-2024'); // valid as DD-MM-YYYY
        expect(parsed).not.toBeNull();
        expect(parsed?.getFullYear()).toBe(2024);
        expect(parsed?.getMonth()).toBe(11);
        expect(parsed?.getDate()).toBe(31);
      });

      it('should fall back to MM-DD-YYYY when DD-MM-YYYY would be invalid', () => {
        const parsed = parseDateValue('12-31-2024'); // invalid as DD-MM (month 31), valid as MM-DD
        expect(parsed).not.toBeNull();
        expect(parsed?.getFullYear()).toBe(2024);
        expect(parsed?.getMonth()).toBe(11);
        expect(parsed?.getDate()).toBe(31);
      });
    });

    describe('internal helpers (private) - isValidByFormat', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isValidByFormat = (Validation as any).isValidByFormat as (
        input: string,
        format: string,
        strict: boolean
      ) => boolean;

      it('should validate YYYY-MM-DD in strict and non-strict mode', () => {
        expect(isValidByFormat('2026-02-03', 'YYYY-MM-DD', true)).toBeTrue();
        expect(isValidByFormat('2026-2-3', 'YYYY-MM-DD', false)).toBeTrue();
        expect(isValidByFormat('2026-13-01', 'YYYY-MM-DD', true)).toBeFalse();
        expect(isValidByFormat('2026-02-30', 'YYYY-MM-DD', true)).toBeFalse();
      });

      it('should validate DD.MM.YYYY strict and non-strict partials', () => {
        expect(isValidByFormat('03.02.2026', 'DD.MM.YYYY', true)).toBeTrue();
        expect(isValidByFormat('3.2.', 'DD.MM.YYYY', false)).toBeTrue();
        expect(isValidByFormat('31.04.2026', 'DD.MM.YYYY', true)).toBeFalse(); // April has 30 days
      });

      it('should validate HH:mm:ss strict and non-strict', () => {
        expect(isValidByFormat('12:30:50', 'HH:mm:ss', true)).toBeTrue();
        expect(isValidByFormat('1:2:3', 'HH:mm:ss', false)).toBeTrue();
        expect(isValidByFormat('24:00:00', 'HH:mm:ss', true)).toBeFalse();
        expect(isValidByFormat('23:60:00', 'HH:mm:ss', true)).toBeFalse();
      });

      it('should validate YYYY-MM-DDTHH:mm:ss[Z] (literal Z only)', () => {
        expect(isValidByFormat('1997-01-01T09:28:00Z', 'YYYY-MM-DDTHH:mm:ss[Z]', true)).toBeTrue();
        expect(isValidByFormat('1997-01-01T09:28:00+01:00', 'YYYY-MM-DDTHH:mm:ss[Z]', true)).toBeFalse();
        expect(isValidByFormat('1997-01-01T09:28:61Z', 'YYYY-MM-DDTHH:mm:ss[Z]', true)).toBeFalse();
      });

      it('should validate MM/YY', () => {
        expect(isValidByFormat('01/26', 'MM/YY', true)).toBeTrue();
        expect(isValidByFormat('13/26', 'MM/YY', true)).toBeFalse();
        expect(isValidByFormat('1/26', 'MM/YY', true)).toBeFalse(); // strict requires 2 digits
      });

      it('should not guess unknown formats in strict mode', () => {
        expect(isValidByFormat('2026-02-03', 'SOME_UNKNOWN_FORMAT', true)).toBeFalse();
      });

      it('should use native Date parsing for unknown formats in non-strict mode', () => {
        // ISO date-time is reliably parseable
        expect(isValidByFormat('2030-01-01T00:00:00Z', 'SOME_UNKNOWN_FORMAT', false)).toBeTrue();
      });
    });

    describe('dateFormat - additional branches (Date and moment-like values)', () => {
      it('should accept a native Date as valid input', () => {
        const control: AbstractControl = new FormControl(new Date());
        const validator: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'DATE');
        expect(validator(control)).toBeNull();
      });

      it('should return an error for Invalid Date input', () => {
        const control: AbstractControl = new FormControl(new Date('invalid'));
        const validator: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'DATE');
        const errors = validator(control);
        errorHaveToBeDefined(errors, undefined, 'DATE');
      });

      it('should accept a moment-like object (toDate()) as valid input', () => {
        const control: AbstractControl = new FormControl(momentLike(new Date()));
        const validator: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'DATE');
        expect(validator(control)).toBeNull();
      });

      it('should return an error for moment-like input if toDate() produces an invalid Date', () => {
        const control: AbstractControl = new FormControl({toDate: () => new Date('invalid')});
        const validator: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', true, 'DATE');
        const errors = validator(control);
        errorHaveToBeDefined(errors, undefined, 'DATE');
      });

      it('should return an error for unknown formats in strict mode', () => {
        const control: AbstractControl = new FormControl('2030-01-01T00:00:00Z');
        const validator: ValidatorFn = Validation.dateFormat('UNKNOWN', true, 'DATE');
        const errors = validator(control);
        errorHaveToBeDefined(errors, undefined, 'DATE');
      });
    });

    describe('isInFuture/isInPast - parsing string/number/moment-like branches', () => {
      it('should treat ISO date-only string (tomorrow) as future', () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const iso = formatYYYYMMDDLocal(tomorrow);
        const control: AbstractControl = new FormControl(iso);
        expect(Validation.isInFuture(control)).toBeNull();
      });

      it('should treat German date string (yesterday) as past', () => {
        const yesterday = addDays(startOfDay(new Date()), -1);
        const de = formatDDMMYYYYLocal(yesterday);
        const control: AbstractControl = new FormControl(de);
        expect(Validation.isInPast(control)).toBeNull();
      });

      it('should parse DD-MM-YYYY string', () => {
        const yesterday = addDays(startOfDay(new Date()), -1);
        const ddmm = formatDDMMYYYYHyphenLocal(yesterday);
        const control: AbstractControl = new FormControl(ddmm);
        expect(Validation.isInPast(control)).toBeNull();
      });

      it('should accept timestamp number inputs', () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const control: AbstractControl = new FormControl(tomorrow.getTime());
        expect(Validation.isInFuture(control)).toBeNull();
      });

      it('should accept moment-like objects via toDate()', () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const control: AbstractControl = new FormControl(momentLike(tomorrow));
        expect(Validation.isInFuture(control)).toBeNull();
      });

      it('should parse ISO date-time with offset in isInPast/isInFuture (valid parse only)', () => {
        const control: AbstractControl = new FormControl('1997-01-01T09:28:00+01:00');
        // Should be parsed successfully, and since it's certainly in the past, isInPast must return INVALIDPASTDATE? (isInPast returns error if today or future)
        // It's in the past => expect null for isInPast
        expect(Validation.isInPast(control)).toBeNull();
      });
    });

    describe('isoDateTime - strictness additional case', () => {
      it('should return INVALIDISODATETIME for ISO date-time with timezone offset', () => {
        const control: AbstractControl = new FormControl('1997-01-01T09:28:00+01:00');
        const errors = Validation.isoDateTime(control);
        errorHaveToBeDefined(errors, undefined, 'INVALIDISODATETIME');
      });
    });

    describe('getHexCodePoint - additional non-string input', () => {
      it('should return "0000" for non-string types (casted)', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(Validation.getHexCodePoint(123 as any, 0)).toBe('0000');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(Validation.getHexCodePoint({} as any, 0)).toBe('0000');
      });
    });

    it('should return "0000" for invalid inputs or out-of-bounds index', () => {
      const testCases = [
        {input: 'A', index: 1}, // out-of-bounds index (NaN index)
        {input: '', index: 0}, // empty string
        {input: null, index: 0}, // null input
        {input: undefined, index: 0} // undefined input
      ];

      testCases.forEach(({input, index}) => {
        const result = Validation.getHexCodePoint(input, index);
        expect(result).toBe('0000');
      });
    });
  });
});
