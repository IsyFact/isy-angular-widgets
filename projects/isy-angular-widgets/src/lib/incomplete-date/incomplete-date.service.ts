import {Injectable} from '@angular/core';
import {DateObject} from './model/model';
import {INCOMPLETE_DATE_REGEX, UNSPECIFIED_DATE_REGEX} from './data/regex';

/**
 * Performs transformations from incomplete dates into german date format DD.MM.YYYY
 */
@Injectable({
  providedIn: 'root'
})
export class IncompleteDateService {
  private readonly DATE_CHAR = 'x';
  private readonly DATE_ZERO = '0000';
  private readonly DATE_ZERO_FORMAT = '00.00.0000';

  /**
   * If the new date is a valid or incomplete date it should be transformed
   * into the german date format. Otherwise, return it empty.
   * @param newValue Value to be transformed
   * @param dateInPastConstraint If true, the date should be in the past
   * @param allowZeroFormat If true, the zero date format e.g. "00.00.0000" for unknown dates should be allowed
   * @returns The transformed date in the german date format
   */
  transformValue(newValue: string, dateInPastConstraint = false, allowZeroFormat = false): string {
    let dateStr = newValue;
    const [day, month, year] = dateStr.split('.');

    if (allowZeroFormat && year === this.DATE_ZERO) return this.DATE_ZERO_FORMAT;

    const adjustedYear = this.adjustYear(year, dateInPastConstraint);
    dateStr = [day, month, adjustedYear].join('.');

    if (this.dateIsUnspecified(dateStr)) dateStr = this.getIncompleteDate(dateStr, allowZeroFormat);

    return dateStr;
  }

  /**
   * Adjusts a year to be in the past if needed
   * E.g. the year "99" in a dateInPast setting is 1999 instead of 2099
   * @param year Year as a string
   * @param dateInPastConstraint If true, the date should be in the past
   * @returns Adjusted year as a string
   */
  private adjustYear(year: string, dateInPastConstraint: boolean): string {
    const maxPartYearLength = 4;
    const coEfficient = 10;
    let partYear = year;
    const partYearNoUnderscore = `${year}`.replaceAll('_', '');

    if (partYearNoUnderscore.length < maxPartYearLength && !partYearNoUnderscore.includes(this.DATE_CHAR)) {
      if (partYearNoUnderscore.length !== 0) {
        const currentYear: number = new Date().getFullYear();
        const numX = coEfficient ** partYearNoUnderscore.length;
        partYear = currentYear.toString().slice(0, -partYearNoUnderscore.length).concat(partYearNoUnderscore);
        partYear =
          Number(partYear) > currentYear && dateInPastConstraint
            ? (Number(partYear) - numX).toString()
            : Number(partYear).toString();
      }
    }

    return partYear;
  }

  /**
   * Takes an incomplete date and transforms it into the german date format.
   * Example: x1.x1.1999 -> xx.xx.1999
   * @param date Date as a string
   * @param allowZeroFormat If true, the zero date format e.g. "00.00.0000" for unknown dates should be allowed
   * @returns The transformed date in the german date format
   */
  private getIncompleteDate(date: string, allowZeroFormat = false): string {
    const formats = date.split('.');
    const dateKeys = ['day', 'month', 'year'];

    const dateObject = dateKeys.reduce<DateObject>(
      (object: DateObject, element: string, index: number) => {
        let partOfFormat = formats[index];

        if (partOfFormat.includes(this.DATE_CHAR)) {
          partOfFormat = this.DATE_CHAR.repeat(partOfFormat.length);
        }

        return {...object, [element]: partOfFormat};
      },
      {day: '', month: '', year: ''}
    );

    const dateStr = Object.values(dateObject).join('.');

    if (
      new RegExp(INCOMPLETE_DATE_REGEX).exec(dateStr) !== null ||
      dateObject.month.includes(this.DATE_CHAR) ||
      dateObject.year.includes(this.DATE_CHAR)
    )
      return 'xx.xx.' + dateObject.year;

    if (allowZeroFormat && dateObject.year === this.DATE_ZERO) return this.DATE_ZERO_FORMAT;

    if (dateObject.month === '00') return '00.00.' + dateObject.year;

    return dateStr;
  }

  /**
   * Check if the date in date format DD.MM.YYYY is unspecified or not
   * @param dateStr Date as a string
   * @returns True or false as a boolean
   */
  private dateIsUnspecified(dateStr: string): boolean {
    return !(
      new RegExp(UNSPECIFIED_DATE_REGEX).exec(dateStr) === null && new RegExp(this.DATE_CHAR).exec(dateStr) === null
    );
  }
}
