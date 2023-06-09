import {Validation} from './validation';

import {TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
import moment from 'moment';

/**
 * Unit-Test der IsyValidators Klasse.
 */
describe('Validation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  describe('future', () => {
    it('should return null if date is not valid', () => {
      const control: AbstractControl = new FormControl('abc');

      const errors = Validation.isInFuture(control);

      expect(errors).toBeNull();
    });

    it('should return null if date is in the future', () => {
      const control: AbstractControl = new FormControl(
        moment()
          .startOf('day')
          .add(1, 'day')
      );

      const errors = Validation.isInFuture(control);

      expect(errors).toBeNull();
    });

    it('should return FUTURE if date is in the past', () => {
      const errorKey = 'FUTURE';
      const control: AbstractControl = new FormControl(
        moment()
          .startOf('day')
          .subtract(1, 'day')
      );

      const errors = Validation.isInFuture(control);
      if (!errors) {
        throw new Error('errors is not defined');
      }

      expect(errors[errorKey]).toBeDefined();
    });
  });

  describe('past', () => {
    it('should return null if date is not valid', () => {
      const control: AbstractControl = new FormControl('abc');

      const errors = Validation.isInPast(control);

      expect(errors).toBeNull();
    });

    it('should return null if date is in the past', () => {
      const control: AbstractControl = new FormControl(
        moment()
          .startOf('day')
          .subtract(1, 'day')
      );

      const errors = Validation.isInPast(control);

      expect(errors).toBeNull();
    });

    it('should return PAST if date is in the future', () => {
      const errorKey = 'PAST';
      const control: AbstractControl = new FormControl(
        moment()
          .startOf('day')
          .add(1, 'day')
      );

      const errors = Validation.isInPast(control);
      if (!errors) {
        throw new Error('errors is not defined');
      }

      expect(errors[errorKey]).toBeDefined();
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

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors.DATE).toBeDefined();
    });

    it('should return validation error, if input is not a valid date after not strict parsing',
      () => {
        const invalidDateControl: AbstractControl = new FormControl('abc');
        const dateValidatorFn: ValidatorFn = Validation.dateFormat('YYYY-MM-DD', false, 'YEAR');

        const errors = dateValidatorFn(invalidDateControl);

        if (!errors) {
          throw new Error('errors is not defined');
        }
        expect(errors.YEAR).toBeDefined();
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

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors.DATE).toBeDefined();
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

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors.TIME).toBeDefined();
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

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors.DATETIME).toBeDefined();
    });
  });

  describe('creditCardNumber', () => {
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
      const errorKey = 'CREDITCARD';
      const control: AbstractControl = new FormControl('4485-8456-9196-5928');

      const errors = Validation.validCreditCardNumber(control);

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors[errorKey]).toBeDefined();
    });

    it('should return CREDITCARD if the value is not only numbers', () => {
      const errorKey = 'CREDITCARD';
      const control: AbstractControl = new FormControl('448s-8456-91g6-5929');

      const errors = Validation.validCreditCardNumber(control);

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors[errorKey]).toBeDefined();
    });

    it('should return CREDITCARD if the value is too short', () => {
      const errorKey = 'CREDITCARD';
      const control: AbstractControl = new FormControl('4485-8456-9');

      const errors = Validation.validCreditCardNumber(control);

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors[errorKey]).toBeDefined();
    });

    it('should return CREDITCARD if the value is too long', () => {
      const errorKey = 'CREDITCARD';
      const control: AbstractControl = new FormControl('4485-8456-9196-59291');

      const errors = Validation.validCreditCardNumber(control);

      if (!errors) {
        throw new Error('errors is not defined');
      }
      expect(errors[errorKey]).toBeDefined();
    });
  });
});
