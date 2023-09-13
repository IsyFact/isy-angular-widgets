import { IncompleteDateService } from './incomplete-date.service';

describe(('IsyIncompleteDate'), () => {
  let sut: IncompleteDateService;

  beforeEach(() => {
    sut = new IncompleteDateService();
  });

  describe('transformValue', () => {
    it('returns a valid date in format DD.MM.YYYY correctly', () => {
      expect(sut.transformValue('01.01.2023')).toBe('01.01.2023');
    });

    it('returns valid future date in format DD.MM.YYYY correctly', () => {
      expect(sut.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('returns an incomplete date in format 00.MM.YYYY correctly', () => {
      expect(sut.transformValue('00.01.2023')).toBe('00.01.2023');
    });

    it('returns an incomplete date in format 00.00.YYYY correctly', () => {
      expect(sut.transformValue('00.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete date in format DD.00.YYYY correctly', () => {
      expect(sut.transformValue('01.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete date with invalid day in format DD.00.YYYY correctly to 00.00.YYYY', () => {
      expect(sut.transformValue('99.00.2023')).toBe('00.00.2023');
    });

    it('transforms an incomplete invalid date day in format 00.MM.0000 correctly to 00.00.0000', () => {
      expect(sut.transformValue('00.01.0000')).toBe('00.00.0000');
    });

    it('transforms valid future date in format DD.MM.YYYY correctly', () => {
      expect(sut.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('transforms an incomplete date in format 00.00.0000 correctly', () => {
      expect(sut.transformValue('00.00.0000')).toBe('00.00.0000');
    });
  });

  describe('transformValue (X for incomplete)', () =>  {
    it('returns an incomplete date in format xx.MM.YYYY correctly', () => {
      expect(sut.transformValue('xx.01.2023')).toBe('xx.01.2023');
    });

    it('returns an incomplete date in format xx.xx.YYYY correctly', () => {
      expect(sut.transformValue('xx.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format DD.xx.YYYY correctly to xx.xx.2023', () => {
      expect(sut.transformValue('01.xx.2023')).toBe('xx.xx.2023');
    });

    it('transforms an incomplete date in format xx.MM.xxxx correctly to xx.xx.xxxx', () => {
      expect(sut.transformValue('xx.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date in format DD.MM.xxxx correctly to xx.xx.xxxx', () => {
      expect(sut.transformValue('01.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('transforms an incomplete date with invalid day in format DD.xx.YYYY correctly to xx.xx.YYYY', () => {
      expect(sut.transformValue('99.xx.2023')).toBe('xx.xx.2023');
    });

    it('returns an incomplete date in format xx.xx.xxxx correctly', () => {
      expect(sut.transformValue('xx.xx.xxxx')).toBe('xx.xx.xxxx');
    });
  });
});
