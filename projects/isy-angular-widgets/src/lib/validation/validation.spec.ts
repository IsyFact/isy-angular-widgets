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
        const errors = Validation.validUnspecifiedDate(control);
        expect(errors).toBeNull();
      });
    });
  });

  describe('unspecifiedDate when input is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
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
        const errors = Validation.validUnspecifiedDate(control);
        expect(errors).toEqual({[errorKey]: true});
      });
    });
  });

  describe('validUnspecifiedISODate when input is valid', () => {
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
        const errors = Validation.validUnspecifiedISODate(control);
        expect(errors).toBeNull();
      });
    });
  });

  describe('validUnspecifiedISODate when input is invalid', () => {
    let control: AbstractControl;
    const errorKey = 'UNSPECIFIEDISODATE';

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

    it('should return FUTURE if date is in the past', () => {
      const errorKey = 'FUTURE';
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

    it('should return PAST if date is in the future', () => {
      const errorKey = 'PAST';
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

    it('should return CREDITCARDEXPIRATIONDATE if the date is in the past', () => {
      const errorKey = 'CREDITCARDEXPIRATIONDATE';
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

    it('should return CREDITCARDEXPIRATIONDATE if the date is not a valid credit card expiration date', () => {
      const errorKey = 'CREDITCARDEXPIRATIONDATE';
      const control: AbstractControl = new FormControl('13/99');
      const errors = Validation.validCreditCardExpirationDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return CREDITCARDEXPIRATIONDATE if no value is given', () => {
      const errorKey = 'CREDITCARDEXPIRATIONDATE';
      const control: AbstractControl = new FormControl();
      const errors = Validation.validCreditCardExpirationDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });

  describe('isoDate', () => {
    it('should return no validation error, if input is a valid iso-date', () => {
      const validIsoDateControl: AbstractControl = new FormControl('2018-11-11');
      const errors = Validation.isoDate(validIsoDateControl);
      expect(errors).toBeNull();
    });

    it('should return validation error with key "DATE", if input is not a valid iso-date', () => {
      const invalidIsoDateControl: AbstractControl = new FormControl('12.12.206');
      const errors = Validation.isoDate(invalidIsoDateControl);
      errorHaveToBeDefined(errors, undefined, 'DATE');
    });
  });

  describe('isoTime', () => {
    it('should return no validation error, if input is a valid iso-time', () => {
      const validIsoTimeControl: AbstractControl = new FormControl('12:30:50');
      const errors = Validation.isoTime(validIsoTimeControl);
      expect(errors).toBeNull();
    });

    it('should return validation error with key "TIME", if input is not a valid iso-time', () => {
      const invalidIsoTimeControl: AbstractControl = new FormControl('45:12:12');
      const errors = Validation.isoTime(invalidIsoTimeControl);
      errorHaveToBeDefined(errors, undefined, 'TIME');
    });
  });

  describe('isoDateTime', () => {
    it('should return no validation error, if input is a valid iso-dateTime', () => {
      const validIsoDateTimeControl: AbstractControl = new FormControl('1997-01-01T09:28:00Z');
      const errors = Validation.isoDateTime(validIsoDateTimeControl);
      expect(errors).toBeNull();
    });

    it('should return validation error with key "DATETIME", if input is not a valid iso-datetime', () => {
      const invalidIsoDateTimeControl: AbstractControl = new FormControl('1997-01-01T9:28:00');
      const errors = Validation.isoDateTime(invalidIsoDateTimeControl);
      errorHaveToBeDefined(errors, undefined, 'DATETIME');
    });
  });

  describe('creditCardNumber', () => {
    const errorKey = 'CREDITCARD';

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

    it('should return CREDITCARD if the value is invalid', () => {
      const control: AbstractControl = new FormControl('4485-8456-9196-5928');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return CREDITCARD if the value is not only numbers', () => {
      const control: AbstractControl = new FormControl('448s-8456-91g6-5929');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return CREDITCARD if the value is too short', () => {
      const control: AbstractControl = new FormControl('4485-8456-9');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return CREDITCARD if the value is too long', () => {
      const control: AbstractControl = new FormControl('4485-8456-9196-59291');
      const errors = Validation.validCreditCardNumber(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });
});
