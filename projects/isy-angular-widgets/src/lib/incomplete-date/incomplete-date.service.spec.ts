/* eslint-disable @typescript-eslint/no-magic-numbers */

import { IncompleteDateService } from './incomplete-date.service';

describe(('IsyIncompleteDate'), () => {

  let sut: IncompleteDateService;
  const format = 'YYYY-MM-DD';
  let todayIso: string;
  let todayIsoParts: string[];
  let todayIsoYear: string;
  let todayIsoMonth: string;
  let todayIsoDay: string;
  let tomorrow: Date;
  let tomorrowIso: string;
  let tomorrowIsoParts: string[];
  let tomorrowIsoYear: string;
  let tomorrowIsoMonth: string;
  let tomorrowIsoDay: string;

  beforeEach(() => {
    const now = new Date();
    sut = new IncompleteDateService();
    todayIso = new Date().toISOString().split('T')[0];
    todayIsoParts = todayIso.split('-');
    todayIsoYear = todayIsoParts[0];
    todayIsoMonth = todayIsoParts[1];
    todayIsoDay = todayIsoParts[2];
    tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrowIso = tomorrow.toISOString().split('T')[0];
    tomorrowIsoParts = tomorrowIso.split('-');
    tomorrowIsoYear = tomorrowIsoParts[0];
    tomorrowIsoMonth = tomorrowIsoParts[1];
    tomorrowIsoDay = tomorrowIsoParts[2];
  });

  describe('transformValue', () => {
    it('handles empty string correctly', () => {
      expect(sut.transformValue('', format)).toBe('');
    });

    it('clears an invalid date, which is not incomplete date', () => {
      expect(sut.transformValue('Micky Mouse', format)).toBe('');
    });

    it('clears an invalid date, which is not incomplete date, but in date format', () => {
      expect(sut.transformValue('99.99.9999', format)).toBe('');
    });

    it('does not transform an invalid date, which is not incomplete date, but in date format', () => {
      expect(sut.transformValue('40.12.9999', format)).toBe('9999-12-00');
    });

    it('clears an invalid date, which is not incomplete date, even with partly date inside', () => {
      expect(sut.transformValue('Micky 2017', format)).toBe('');
    });

    it('transforms a valid date in format YYYY-MM-DD correctly to the output format', () => {
      expect(sut.transformValue('2017-07-01', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format YYYY.MM.DD correctly to the output format', () => {
      expect(sut.transformValue('2017.07.01', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format YYYY/MM/DD correctly to the output format', () => {
      expect(sut.transformValue('2017/07/01', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format YYYYMMDD correctly to the output format', () => {
      expect(sut.transformValue('20170701', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format DD-MM-YYYY correctly to the output format', () => {
      expect(sut.transformValue('01-07-2017', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format DD.MM.YYYY correctly to the output format', () => {
      expect(sut.transformValue('01.07.2017', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format DD/MM/YYYY correctly to the output format', () => {
      expect(sut.transformValue('01/07/2017', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format DDMMYYYY correctly to the output format', () => {
      expect(sut.transformValue('01072017', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format DD-MM-YY correctly to the output format', () => {
      expect(sut.transformValue('01-07-17', format)).toBe('2017-07-01');
    });

    it('transforms a valid date in format DD-MM-YY correctly to the output format with dateInPastConstraint if date is today', () => {
      const todayFormat = `${todayIsoDay}-${todayIsoMonth}-${todayIsoYear.substr(2)}`;

      expect(sut.transformValue(todayFormat, format, true)).toBe(todayIso);
    });

    it('transforms a valid date in format DD-MM-YY correctly to the output format with dateInPastConstraint if date is tomorrow', () => {
      const tomorrowInPreviousCentury = `${+tomorrowIsoYear - 100}-${tomorrowIsoMonth}-${tomorrowIsoDay}`;
      const tomorrowFormat = `${tomorrowIsoDay}-${tomorrowIsoMonth}-${tomorrowIsoYear.substr(2)}`;

      expect(sut.transformValue(tomorrowFormat, format, true)).toBe(tomorrowInPreviousCentury);
    });

    it('transforms future date to previous century for D.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('3.7.50', format, true)).toBe('1950-07-03');
    });

    it('transforms past date for D.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('3.7.03', format, true)).toBe('2003-07-03');
    });

    it('transforms a valid date in format D.M.YY correctly to the output format', () => {
      expect(sut.transformValue('4.8.17', format)).toBe('2017-08-04');
    });

    it('transforms a valid date in format DD.M.YY correctly to the output format', () => {
      expect(sut.transformValue('04.8.17', format)).toBe('2017-08-04');
    });

    it('transforms future date to previous century for DD.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('10.7.50', format, true)).toBe('1950-07-10');
    });

    it('transforms past date for DD.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('11.7.03', format, true)).toBe('2003-07-11');
    });

    it('transforms a valid date in format D.M.YYYYY correctly to the output format', () => {
      expect(sut.transformValue('4.8.2017', format)).toBe('2017-08-04');
    });

    it('transforms an incomplete date in format D.0.YY correctly to the output format', () => {
      expect(sut.transformValue('7.0.17', format)).toBe('2017-00-07');
    });

    it('transforms future date to previous century for D.0.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('10.0.50', format, true)).toBe('1950-00-10');
    });

    it('transforms past date for D.0.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('11.0.03', format, true)).toBe('2003-00-11');
    });

    it('transforms an incomplete date in format 0.M.YY correctly to the output format', () => {
      expect(sut.transformValue('0.7.17', format)).toBe('2017-07-00');
    });

    it('transforms future date to previous century for 0.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('0.7.50', format, true)).toBe('1950-07-00');
    });

    it('transforms past date for 0.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('0.9.03', format, true)).toBe('2003-09-00');
    });

    it('transforms an incomplete date in format D.0.YYYY correctly to the output format', () => {
      expect(sut.transformValue('7.0.2017', format)).toBe('2017-00-07');
    });

    it('transforms an incomplete date in format 0.M.YYYY correctly to the output format', () => {
      expect(sut.transformValue('0.7.2017', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format 00MMYYYY correctly to the output format', () => {
      expect(sut.transformValue('00072017', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format 00-MM-YYYY correctly to the output format', () => {
      expect(sut.transformValue('00-07-2017', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format 00-00-YYYY correctly to the output format', () => {
      expect(sut.transformValue('00-00-2017', format)).toBe('2017-00-00');
    });

    it('transforms an incomplete date in format YYYYMM00 correctly to the output format', () => {
      expect(sut.transformValue('20170700', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format YYYY-MM-00 correctly to the output format', () => {
      expect(sut.transformValue('2017-07-00', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format YYYY-00-00 correctly to the output format', () => {
      expect(sut.transformValue('2017-00-00', format)).toBe('2017-00-00');
    });

    it('transforms an incomplete date in format 00-MM-YY correctly to the output format', () => {
      expect(sut.transformValue('00-07-17', format)).toBe('2017-07-00');
    });

    it('transforms future date to previous century for 0.MM.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('0.11.50', format, true)).toBe('1950-11-00');
    });

    it('transforms past date for 0.MM.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('0.12.04', format, true)).toBe('2004-12-00');
    });

    it('transforms an incomplete date in format YYYY-MM correctly to the output format', () => {
      expect(sut.transformValue('2017-07', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format YYYYMM correctly to the output format', () => {
      expect(sut.transformValue('201707', format)).toBe('2017-07-00');
    });

    it('transforms an incomplete date in format YYYY correctly to the output format', () => {
      expect(sut.transformValue('2017', format)).toBe('2017-00-00');
    });

    // nicht mehr supported, aufgrund verwechslungsgefahr mit YYYYMM
    it('clears an incomplete date in format MMYYYY', () => {
      expect(sut.transformValue('072017', format)).toBe('');
    });

    it('transforms 00.00.0000 correctly to the output format', () => {
      expect(sut.transformValue('00.00.0000', format)).toBe('0000-00-00');
    });
  });

  describe('transformValue (X for incomplete)', () =>  {
    it('transforms an incomplete date in format D.X.YY correctly to the output format', () => {
      expect(sut.transformValue('7.X.17', format)).toBe('2017-XX-07');
    });

    it('transforms future date to previous century for D.X.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('10.X.50', format, true)).toBe('1950-XX-10');
    });

    it('transforms past date for D.X.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('11.X.03', format, true)).toBe('2003-XX-11');
    });

    it('transforms an incomplete date in format X.M.YY correctly to the output format', () => {
      expect(sut.transformValue('X.7.17', format)).toBe('2017-07-XX');
    });

    it('transforms future date to previous century for X.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('X.7.50', format, true)).toBe('1950-07-XX');
    });

    it('transforms past date for X.M.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('X.9.03', format, true)).toBe('2003-09-XX');
    });

    it('transforms an incomplete date in format D.X.YYYY correctly to the output format', () => {
      expect(sut.transformValue('7.X.2017', format)).toBe('2017-XX-07');
    });

    it('transforms an incomplete date in format X.M.YYYY correctly to the output format', () => {
      expect(sut.transformValue('X.7.2017', format)).toBe('2017-07-XX');
    });

    it('transforms an incomplete date in format XXMMYYYY correctly to the output format', () => {
      expect(sut.transformValue('XX072017', format)).toBe('2017-07-XX');
    });

    it('transforms an incomplete date in format XX-MM-YYYY correctly to the output format', () => {
      expect(sut.transformValue('XX-07-2017', format)).toBe('2017-07-XX');
    });

    it('transforms an incomplete date in format XX-XX-YYYY correctly to the output format', () => {
      expect(sut.transformValue('XX-XX-2017', format)).toBe('2017-XX-XX');
    });

    it('transforms an incomplete date in format YYYYMMXX correctly to the output format', () => {
      expect(sut.transformValue('201707XX', format)).toBe('2017-07-XX');
    });

    it('transforms an incomplete date in format YYYY-MM-XX correctly to the output format', () => {
      expect(sut.transformValue('2017-07-XX', format)).toBe('2017-07-XX');
    });

    it('transforms an incomplete date in format YYYY-XX-XX correctly to the output format', () => {
      expect(sut.transformValue('2017-XX-XX', format)).toBe('2017-XX-XX');
    });

    it('transforms an incomplete date in format YYYYXXXX correctly to the output format', () => {
      expect(sut.transformValue('2017XXXX', format)).toBe('2017-XX-XX');
    });

    it('transforms an incomplete date in format XXXXYYYY correctly to the output format', () => {
      expect(sut.transformValue('XXXX0000', format)).toBe('0000-XX-XX');
    });

    it('transforms an incomplete date in format XX-MM-YY correctly to the output format', () => {
      expect(sut.transformValue('XX-07-17', format)).toBe('2017-07-XX');
    });

    it('transforms future date to previous century for X.MM.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('X.11.50', format, true)).toBe('1950-11-XX');
    });

    it('transforms past date for X.MM.YY with dateInPastConstraint', () => {
      expect(sut.transformValue('X.12.04', format, true)).toBe('2004-12-XX');
    });

    it('transforms XX.XX.0000 correctly to the output format', () => {
      expect(sut.transformValue('XX.XX.0000', format)).toBe('0000-XX-XX');
    });

    it('transforms XX/XX/0000 correctly to the output format', () => {
      expect(sut.transformValue('XX/XX/0000', format)).toBe('0000-XX-XX');
    });
  });
});
