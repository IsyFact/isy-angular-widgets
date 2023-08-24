import { IncompleteDateService } from './incomplete-date.service';

describe(('IsyIncompleteDate'), () => {
  let sut: IncompleteDateService;

  beforeEach(() => {
    sut = new IncompleteDateService();
  });

  describe('transformValue', () => {
    it('clears an invalid date, which is not incomplete date, but in date format', () => {
      expect(sut.transformValue('99.99.9999')).toBe('');
    });

    it('does not transform an invalid date, which is not incomplete date, but in date format', () => {
      expect(sut.transformValue('99.01.2023')).toBe('');
    });

    it('does not transform an invalid date, which is not incomplete date, but in date format', () => {
      expect(sut.transformValue('01.99.2023')).toBe('');
    });

    it('transforms a valid date in format DD.MM.YYYY correctly to the output format', () => {
      expect(sut.transformValue('01.01.2023')).toBe('01.01.2023');
    });

    it('does not transform valid future date if the year is greater than todays year for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(sut.transformValue('01.01.2024', true)).toBe('');
    });

    it('transforms valid future date in format DD.MM.YYYY correctly to the output format', () => {
      expect(sut.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('transforms an incomplete date in format 00.MM.YYYY correctly to the output format', () => {
      expect(sut.transformValue('00.01.2023')).toBe('00.01.2023');
    });

    it('transforms an incomplete date in format 00.00.YYYY correctly to the output format', () => {
      expect(sut.transformValue('00.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete date in format DD.00.YYYY correctly to the output format', () => {
      expect(sut.transformValue('01.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete date with invalid day in format DD.00.YYYY correctly to the output format', () => {
      expect(sut.transformValue('99.00.2023')).toBe('00.00.2023');
    });

    it('does not transform an incomplete date with invalid month in format 00.MM.YYYY', () => {
      expect(sut.transformValue('00.99.2023')).toBe('');
    });

    it('transforms an incomplete invalid date day in format 00.MM.0000 correctly to the output format', () => {
      expect(sut.transformValue('00.01.0000')).toBe('00.00.0000');
    });

    it('does not transform incomplete future date if the year is greater than todays year for 00.MM.YYYY with dateInPastConstraint', () => {
      expect(sut.transformValue('00.01.2024', true)).toBe('');
    });

    it('does not transform incomplete future date if the year is greater than todays year for 00.00.YYYY with dateInPastConstraint', () => {
      expect(sut.transformValue('00.00.2024', true)).toBe('');
    });

    it('transforms valid future date in format DD.MM.YYYY correctly to the output format', () => {
      expect(sut.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('transforms an incomplete date in format 00.00.0000 correctly to the output format', () => {
      expect(sut.transformValue('00.00.0000')).toBe('00.00.0000');
    });
  });

  describe('transformValue (X for incomplete)', () =>  {
    it('transforms an incomplete date in format xx.MM.YYYY correctly to the output format', () => {
      expect(sut.transformValue('xx.01.2023')).toBe('xx.01.2023');
    });

    it('transforms an incomplete date in format xx.xx.YYYY correctly to the output format', () => {
      expect(sut.transformValue('xx.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format DD.xx.YYYY correctly to the output format', () => {
      expect(sut.transformValue('01.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format xx.MM.xxxx correctly to the output format', () => {
      expect(sut.transformValue('xx.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.MM.xxxx correctly to the output format', () => {
      expect(sut.transformValue('01.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date with invalid day in format DD.xx.YYYY correctly to the output format', () => {
      expect(sut.transformValue('99.xx.2023')).toBe('xx.xx.2023');
    });

    it('does not transform an incomplete date with invalid month in format xx.MM.YYYY', () => {
      expect(sut.transformValue('xx.99.2023')).toBe('');
    });

    it('does not transform incomplete future date if the year is greater than todays year for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(sut.transformValue('xx.01.2024', true)).toBe('');
    });

    it('does not transform incomplete future date if the year is greater than todays year for xx.xx.YYYY with dateInPastConstraint', () => {
      expect(sut.transformValue('xx.xx.2024', true)).toBe('');
    });

    it('transforms an incomplete date in format xx.xx.xxxx correctly to the output format', () => {
      expect(sut.transformValue('xx.xx.xxxx')).toBe('xx.xx.xxxx');
    });
  });
});
