import {Pipe, PipeTransform} from '@angular/core';
import {INCOMPLETE_DATE_FORMATS_REGEX, INCOMPLETE_DATE_GERMAN_FORMATS_REGEX} from './data/regex';
import {DATE_FORMAT_ERROR} from './data/errors';

/**
 * Converts an unspecified date string from the format YYYY-MM-DD to the German date format DD.MM.YYYY.
 * Example: '2024-00-00' becomes '00.00.2024' or 2024-xx-xx becomes xx.xx.2024.
 * If 'xx' or '00' are not present, e.g. '2024-01-01' becomes '01.01.2024'.
 * An error is thrown if the input does not match YYYY-MM-DD or DD.MM.YYYY.
 */
@Pipe({
  name: 'incompleteDatePipe'
})
export class IncompleteDatePipe implements PipeTransform {
  /**
   * Converts an unspecified date string to the German format DD.MM.YYYY.
   * Throws an error for invalid date formats.
   * @param value Date string in YYYY-MM-DD or DD.MM.YYYY format.
   * @returns Date string in DD.MM.YYYY format.
   */
  transform(value: string | null | undefined): string {
    if (!value || value === '') return '';

    const valueInLowerCase = value.toLowerCase();

    // Check if the value matches the German date format and return as is if it does
    if (INCOMPLETE_DATE_GERMAN_FORMATS_REGEX.some((format) => format.test(valueInLowerCase))) return valueInLowerCase;

    // Check if the value matches a specified date format, throw an error if it doesn't
    if (!INCOMPLETE_DATE_FORMATS_REGEX.some((format) => format.test(valueInLowerCase)))
      throw new Error(DATE_FORMAT_ERROR);

    const [year, month, day] = valueInLowerCase.split('-');

    return this.formatDate(year, month, day);
  }

  /**
   * Private helper method to format the date components into a day.month.year format
   * @param year The year string
   * @param month The month string
   * @param day The day string
   * @returns The date string in German date format
   */
  private formatDate(year: string, month: string, day: string): string {
    return [day, month, year].join('.');
  }
}
