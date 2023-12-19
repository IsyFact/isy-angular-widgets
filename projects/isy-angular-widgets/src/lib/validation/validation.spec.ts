import {Validation} from './validation';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {startOfDay, add, sub, format} from 'date-fns';

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

  describe('unspecifiedDate', () => {
    const errorKey = 'UNSPECIFIEDDATE';

    it('should return no validation error, if input is empty', () => {
      const validDateControl: AbstractControl = new FormControl('');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return no validation error, if input is null', () => {
      const validDateControl: AbstractControl = new FormControl(null);
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return null if date is valid', () => {
      const validDateControl: AbstractControl = new FormControl('11.11.2023');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return UNSPECIFIEDDATE if the day is invalid', () => {
      const control: AbstractControl = new FormControl('50.11.2023');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return UNSPECIFIEDDATE if the month is invalid', () => {
      const control: AbstractControl = new FormControl('01.30.2023');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return null if date is unspecified in german date format 00.MM.YYYY', () => {
      const validDateControl: AbstractControl = new FormControl('00.11.2023');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return null if date is unspecified in german date format 00.00.YYYY', () => {
      const validDateControl: AbstractControl = new FormControl('00.00.2023');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return null if date is unspecified in german date format 00.00.0000', () => {
      const validDateControl: AbstractControl = new FormControl('00.00.0000');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return UNSPECIFIEDDATE if date is unspecified and the month is invalid in german date format 00.MM.YYYY', () => {
      const control: AbstractControl = new FormControl('00.13.2023');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return UNSPECIFIEDDATE if date is in german date format DD.00.YYYY', () => {
      const control: AbstractControl = new FormControl('01.00.2023');
      const errors = Validation.validUnspecifiedDate(control);

      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return null if date is unspecified in german date format xx.MM.YYYY', () => {
      const validDateControl: AbstractControl = new FormControl('xx.11.2023');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return null if date is unspecified in german date format xx.xx.YYYY', () => {
      const validDateControl: AbstractControl = new FormControl('xx.xx.2023');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return null if date is unspecified in german date format xx.xx.xxxx', () => {
      const validDateControl: AbstractControl = new FormControl('xx.xx.xxxx');
      const errors = Validation.validUnspecifiedDate(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return UNSPECIFIEDDATE if date is unspecified and the month is invalid in german date format xx.MM.YYYY', () => {
      const control: AbstractControl = new FormControl('xx.13.2023');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return UNSPECIFIEDDATE if date is in german date format DD.xx.2022', () => {
      const control: AbstractControl = new FormControl('01.xx.2023');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return UNSPECIFIEDDATE if date is in german date format xx.MM.xxxx', () => {
      const control: AbstractControl = new FormControl('xx.01.xxxx');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return UNSPECIFIEDDATE if date is in german date format DD.xx.xxxx', () => {
      const control: AbstractControl = new FormControl('01.xx.xxxx');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });

    it('should return UNSPECIFIEDDATE if date is in german date format DD.MM.xxxx', () => {
      const control: AbstractControl = new FormControl('01.01.xxxx');
      const errors = Validation.validUnspecifiedDate(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });

  describe('future', () => {
    it('should return null for empty input', () => {
      const result = Validation.isInFuture(new FormControl(''));
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = Validation.isInFuture(new FormControl(null));
      expect(result).toBeNull();
    });

    it('should handle Date instance correctly', () => {
      const dateInTheFuture = new Date();
      dateInTheFuture.setDate(dateInTheFuture.getDate() + 1);
      const control = new FormControl(dateInTheFuture);
      const errors = Validation.isInFuture(control);
      expect(errors).toBeNull();
    });

    it('should return null if date is not valid', () => {
      const control: AbstractControl = new FormControl('abc');
      const errors = Validation.isInFuture(control);
      expect(errors).toBeNull();
    });

    it('should return null if date is in the future', () => {
      const control: AbstractControl = new FormControl(format(add(startOfDay(new Date()), {days: 1}), 'yyyy-MM-dd'));
      const errors = Validation.isInFuture(control);
      expect(errors).toBeNull();
    });

    it('should return FUTURE if date is in the past', () => {
      const errorKey = 'FUTURE';
      const control: AbstractControl = new FormControl(format(sub(startOfDay(new Date()), {days: 1}), 'yyyy-MM-dd'));
      const errors = Validation.isInFuture(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });

  describe('past', () => {
    it('should return null for empty input', () => {
      const result = Validation.isInPast(new FormControl(''));
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = Validation.isInPast(new FormControl(null));
      expect(result).toBeNull();
    });

    it('should handle Date instance correctly', () => {
      const dateInThePast = new Date();
      dateInThePast.setDate(dateInThePast.getDate() - 1);
      const control = new FormControl(dateInThePast);
      const errors = Validation.isInPast(control);
      expect(errors).toBeNull();
    });

    it('should return null if date is not valid', () => {
      const control: AbstractControl = new FormControl('abc');
      const errors = Validation.isInPast(control);
      expect(errors).toBeNull();
    });

    it('should return null if date is in the past', () => {
      const control: AbstractControl = new FormControl(format(sub(startOfDay(new Date()), {days: 1}), 'yyyy-MM-dd'));
      const errors = Validation.isInPast(control);
      expect(errors).toBeNull();
    });

    it('should return PAST if date is in the future', () => {
      const errorKey = 'PAST';
      const control: AbstractControl = new FormControl(format(add(startOfDay(new Date()), {days: 1}), 'yyyy-MM-dd'));
      const errors = Validation.isInPast(control);
      errorHaveToBeDefined(errors, errorKey);
    });
  });

  describe('dateFormat', () => {
    it('should return no validation error, if input is empty', () => {
      const validDateControl: AbstractControl = new FormControl('');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('dd.MM.yyyy', 'DATE', true);
      const errors = dateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return no validation error, if input is null', () => {
      const validDateControl: AbstractControl = new FormControl(null);
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('dd.MM.yyyy', 'DATE', true);
      const errors = dateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return no validation error, if input is a valid date with required format', () => {
      const validDateControl: AbstractControl = new FormControl('11.11.2017');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('dd.MM.yyyy', 'DATE', true);
      const errors = dateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return no validation error, if input is a valid date after not strict parsing', () => {
      const validDateControl: AbstractControl = new FormControl('1.1.1');
      const valideDateValidatorFn: ValidatorFn = Validation.dateFormat('dd.MM.yyyy', 'DATE', false);
      const errors = valideDateValidatorFn(validDateControl);
      expect(errors).toBeNull();
    });

    it('should return validation error, if input is not a valid date with required format', () => {
      const invalidDateControl: AbstractControl = new FormControl('1995-1-13');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('yyyy-MM-dd', 'DATE', true);
      const errors = dateValidatorFn(invalidDateControl);
      errorHaveToBeDefined(errors, undefined, 'DATE');
    });

    it('should return validation error, if input is not a valid date after not strict parsing', () => {
      const invalidDateControl: AbstractControl = new FormControl('abc');
      const dateValidatorFn: ValidatorFn = Validation.dateFormat('yyyy-MM-dd', 'YEAR', false);
      const errors = dateValidatorFn(invalidDateControl);
      errorHaveToBeDefined(errors, undefined, 'YEAR');
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
