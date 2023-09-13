import {TestBed} from '@angular/core/testing';
import {IncompleteDateService} from './incomplete-date.service';

describe(('IsyIncompleteDate'), () => {
  let service: IncompleteDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncompleteDateService);
  });

  describe('transformValue', () => {
    it('returns a valid date in format DD.MM.YYYY correctly', () => {
      expect(service.transformValue('01.01.2023')).toBe('01.01.2023');
    });

    it('returns valid future date in format DD.MM.YYYY correctly', () => {
      expect(service.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('returns an incomplete date in format 00.MM.YYYY correctly', () => {
      expect(service.transformValue('00.01.2023')).toBe('00.01.2023');
    });

    it('returns an incomplete date in format 00.00.YYYY correctly', () => {
      expect(service.transformValue('00.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete date in format DD.00.YYYY correctly', () => {
      expect(service.transformValue('01.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete date with invalid day in format DD.00.YYYY correctly to 00.00.YYYY', () => {
      expect(service.transformValue('99.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete invalid date day in format 00.MM.0000 correctly to 00.00.0000', () => {
      expect(service.transformValue('00.01.0000')).toBe('00.00.0000');
    });

    it('transforms valid future date in format DD.MM.YYYY correctly', () => {
      expect(service.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('transforms an incomplete date in format 00.00.0000 correctly', () => {
      expect(service.transformValue('00.00.0000')).toBe('00.00.0000');
    });

    it('transforms future date for DD.MM.YYYY', () => {
      expect(service.transformValue('01.01.9___')).toBe('01.01.2029');
    });

    it('transforms future date for DD.MM.YYYY', () => {
      expect(service.transformValue('01.01.99__')).toBe('01.01.2099');
    });

    it('transforms future date for DD.MM.YYYY', () => {
      expect(service.transformValue('01.01.999_')).toBe('01.01.2999');
    });

    it('transforms past date for DD.MM.YYYY', () => {
      expect(service.transformValue('01.01.21__')).toBe('01.01.2021');
    });

    it('transforms future date to past date year for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('01.01.9___', true)).toBe('01.01.2019');
    });

    it('transforms future date to previous century for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('01.01.50__', true)).toBe('01.01.1950');
    });

    it('transforms future date to previous century for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('01.01.999_', true)).toBe('01.01.1999');
    });

    it('transforms past date for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('01.01.03__', true)).toBe('01.01.2003');
    });
  });

  describe('transformValue (X for incomplete)', () =>  {
    it('returns an incomplete date in format xx.MM.YYYY correctly', () => {
      expect(service.transformValue('xx.01.2023')).toBe('xx.01.2023');
    });

    it('transforms an incomplete date in format xD.MM.YYYY correctly to xx.01.2023', () => {
      expect(service.transformValue('x1.01.2023')).toBe('xx.01.2023');
    });

    it('transforms an incomplete date in format Dx.MM.YYYY correctly to xx.01.2023', () => {
      expect(service.transformValue('1x.01.2023')).toBe('xx.01.2023');
    });

    it('transforms an incomplete date in format DD.xx.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('01.xx.2023')).toBe('xx.xx.2023');
    });

    it('returns an incomplete date in format xx.xx.YYYY correctly', () => {
      expect(service.transformValue('xx.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format xD.xx.YYYY correctly', () => {
      expect(service.transformValue('x1.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format Dx.xx.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('1x.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format xx.xM.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('xx.x1.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format xx.Mx.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('xx.1x.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format xD.xM.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('x1.x1.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format Dx.Mx.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('1x.1x.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format Dx.xM.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('1x.x1.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format Dx.Mx.YYYY correctly to xx.xx.2023', () => {
      expect(service.transformValue('x1.1x.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format DD.MM.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format xx.MM.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('xx.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format xD.MM.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('x1.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format Dx.MM.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('1x.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.xx.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.xx.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.xM.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.x1.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.Mx.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.1x.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format xx.xM.xxxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('xx.x1.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.MM.xxx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.01.xxx_')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.MM.xx correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.01.xx__')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format xx.Mx.x correctly to xx.xx.xxxx', () => {
      expect(service.transformValue('01.01.x___')).toBe('xx.xx.xxxx');
    });

    it('returns an incomplete date in format xx.xx.xxxx correctly', () => {
      expect(service.transformValue('xx.xx.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete future date in format xx.MM.Y correctlyto xx.01.2029', () => {
      expect(service.transformValue('xx.01.9__')).toBe('xx.01.2029');
    });

    it('transforms an incomplete future date in format xx.MM.YY correctlyto xx.01.2099', () => {
      expect(service.transformValue('xx.01.99__')).toBe('xx.01.2099');
    });

    it('transforms an incomplete future date in format xx.MM.YYY correctlyto xx.01.2999', () => {
      expect(service.transformValue('xx.01.999_')).toBe('xx.01.2999');
    });

    it('transforms an incomplete future date in format xx.xx.Y correctly to xx.xx.2029', () => {
      expect(service.transformValue('xx.xx.9___')).toBe('xx.xx.2029');
    });

    it('transforms an incomplete future date in format xx.xx.YY correctly to xx.xx.2099', () => {
      expect(service.transformValue('xx.xx.99__')).toBe('xx.xx.2099');
    });

    it('transforms an incomplete future date in format xx.xx.YYY correctly to xx.xx.2999', () => {
      expect(service.transformValue('xx.xx.999_')).toBe('xx.xx.2999');
    });

    it('transforms an incomplete future date to past date year for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('xx.01.9___', true)).toBe('xx.01.2019');
    });

    it('transforms an incomplete future date to previous century for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('xx.01.50__', true)).toBe('xx.01.1950');
    });

    it('transforms an incomplete future date to previous century for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('xx.01.999_', true)).toBe('xx.01.1999');
    });

    it('transforms an incomplete future date for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(service.transformValue('xx.01.03__', true)).toBe('xx.01.2003');
    });
  });
});
