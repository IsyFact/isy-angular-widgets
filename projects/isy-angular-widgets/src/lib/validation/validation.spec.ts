import {Validation} from './validation';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import moment from 'moment';

/**
 * Unit-Test der IsyValidators Klasse.
 */
describe('Unit Test: Validation', () => {
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
      const control: AbstractControl = new FormControl(moment().startOf('day').add(1, 'day'));
      const errors = Validation.isInFuture(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDFUTUREDATE if date is in the past', () => {
      const errorKey = 'INVALIDFUTUREDATE';
      const control: AbstractControl = new FormControl(moment().startOf('day').subtract(1, 'day'));
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
      const control: AbstractControl = new FormControl(moment().startOf('day').subtract(1, 'day'));
      const errors = Validation.isInPast(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDPASTDATE if date is in the future', () => {
      const errorKey = 'INVALIDPASTDATE';
      const control: AbstractControl = new FormControl(moment().startOf('day').add(1, 'day'));
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
      const control: AbstractControl = new FormControl(moment().add(1, 'year').format('MM/YY'));
      const errors = Validation.validCreditCardExpirationDate(control);
      expect(errors).toBeNull();
    });

    it('should return INVALIDCREDITCARDEXPIRATIONDATE if the date is in the past', () => {
      const errorKey = 'INVALIDCREDITCARDEXPIRATIONDATE';
      const control: AbstractControl = new FormControl(moment().subtract(1, 'year').format('MM/YY'));
      const errors = Validation.validCreditCardExpirationDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return null if the date is a valid credit card expiration date', () => {
      const actualDate = moment().format('MM/YY');
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

    it('should return INVALIDCREDITCARDNUMBER if the value is invalid', () => {
      const control: AbstractControl = new FormControl('4485-8456-9196-5928');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return INVALIDCREDITCARDNUMBER if the value is not only numbers', () => {
      const control: AbstractControl = new FormControl('448s-8456-91g6-5929');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return INVALIDCREDITCARDNUMBER if the value is too short', () => {
      const control: AbstractControl = new FormControl('4485-8456-9');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return INVALIDCREDITCARDNUMBER if the value is too long', () => {
      const control: AbstractControl = new FormControl('4485-8456-9196-59291');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
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
