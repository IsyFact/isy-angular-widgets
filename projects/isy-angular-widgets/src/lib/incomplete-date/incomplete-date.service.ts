/* eslint-disable @typescript-eslint/no-magic-numbers */

import {Injectable} from '@angular/core';
import moment from 'moment';

/**
 * Performs transformations from incomplete dates into different formats
 */
@Injectable()
export class IncompleteDateService {

  private readonly defaultFormat = 'YYYY-MM-DD';

  /**
   * Valid date formats for user input
   */
  private readonly validInputDateFormats: string[] = [
    'DD-MM-YYYY', 'DD-MM-YY', 'YYYY-MM-DD', 'D-M-YY', 'D-M-YYYY', 'YYYY-M-D',
    'DD.MM.YYYY', 'DD.MM.YY', 'YYYY.MM.DD', 'D.M.YY', 'D.M.YYYY', 'YYYY.M.D',
    'DD/MM/YYYY', 'DD/MM/YY', 'YYYY/MM/DD', 'D/M/YY', 'D/M/YYYY', 'YYYY/M/D',
    'DDMMYYYY', 'DDMMYY', 'YYMMDD', 'YYYYMMDD'
  ];

  // the order of the formats is important (s. https://momentjs.com/docs/#/parsing/string-formats/)
  private readonly incompleteDateFormats: string[] = [
    '00-00-YYYY', 'YYYY', 'YYYYMM', 'MM-YYYY', 'YYYY-MM',
    'DD-00-YYYY', 'D-00-YYYY', '00-MM-YYYY', '00-M-YYYY',
    'D-0-YYYY', '0-M-YYYY',
    'YYYY-00-00', 'YYYY-00-DD', 'YYYY-MM-00',
    '[XX]-[XX]-YYYY',
    'DD-[XX]-YYYY', 'D-[XX]-YYYY', '[XX]-MM-YYYY', '[XX]-M-YYYY',
    'D-[X]-YYYY', '[X]-M-YYYY',
    'YYYY-[XX]-[XX]', 'YYYY-[XX]-DD', 'YYYY-MM-[XX]'];

  private readonly separators = new RegExp(/[.,\-/]/, 'g');

  /**
   * If the new date is a valid or incomplete date it should be transformed
   * into the given format. Otherwise, return it unchanged.
   * @param newValue Value to be transformed
   * @param format Target format
   * @param dateInPastConstraint If true, the date should be in the past
   * @returns The transformed date in the given format
   */
  transformValue(newValue: string, format = this.defaultFormat, dateInPastConstraint = false): string {
    if (!newValue) {
      return '';
    }

    // add the given format to the list of valid formats
    const allValidFormats = this.validInputDateFormats.concat(format);

    let result: string;
    if (moment(newValue, allValidFormats, true).isValid()) {
      let target = moment(newValue, allValidFormats, true);
      if (dateInPastConstraint && target.isAfter(moment())) {
        // e.g. the year "99" in a dateInPast setting is 1999 instead of 2099
        target = target.subtract(100, 'year');
      }
      result = target.format(format);
    } else {
      result = this.getIncompleteDate(newValue, format, dateInPastConstraint);
    }

    return result;
  }

  /**
   * Takes an incomplete date and transforms it into the given format.
   * Example: 00-00-1999, YYYY.MM.DD -> 1999.00.00
   * If a number is supplied it will be used as the year: 2017, YYYY-00-00 -> 2017-00-00
   * @param date Date as a string
   * @param format Target format
   * @param dateInPastConstraint If true, the date should be in the past
   * @returns The transformed date in the given format
   */
  private getIncompleteDate(date: string, format: string, dateInPastConstraint = false): string {
    if (date && moment(date, this.incompleteDateFormats).isValid() && !(/[a-zA-WY-Z]/.test(date))) {
      // if an 'X' is found in the input, 'X' will be used as a placeholder for unknown days and months instead of '0'
      const usesXForUnknown = date.includes('X');

      if (!format) {
        format = this.defaultFormat;
      }
      let year = '';
      let month = '';
      let day = '';
      // determine the format used by the incomplete date, for example 00-MM-YYYY
      const usedDateFormat = moment(date, this.incompleteDateFormats).creationData().format as string;
      // remove [ and ] around X since they were only used for moment()
      const usedDateFormatNoEscapes = usedDateFormat.replace(/[\[\]]/g, '');

      // extract year, date and month from the date string
      if (date.match(this.separators)) { // contains seperators
        const formats: string[] = usedDateFormatNoEscapes.split(this.separators) ? usedDateFormatNoEscapes.split(this.separators) : [usedDateFormatNoEscapes];
        formats.forEach((partOfFormat, i) => {
          if (partOfFormat.includes('Y')) {
            year = date.split(this.separators)[i];
          }
          if (partOfFormat.includes('M')) {
            month = date.split(this.separators)[i];
          }
          if (partOfFormat.includes('D')) {
            day = date.split(this.separators)[i];
          }
        });
      } else {
        // normalize the date and the format
        const usedDateFormatNoSeparators = usedDateFormatNoEscapes.replace(this.separators, '');
        const dateNoSeparators = date.replace(this.separators, '');

        usedDateFormatNoSeparators.split('').forEach((partOfFormat, i) => {
          if (partOfFormat === 'Y' && dateNoSeparators.length >= i) {
            year += dateNoSeparators.charAt(i);
          }
          if (partOfFormat === 'M' && dateNoSeparators.length >= i) {
            month += dateNoSeparators.charAt(i);
          }
          if (partOfFormat === 'D' && dateNoSeparators.length >= i) {
            day += dateNoSeparators.charAt(i);
          }
        });
      }

      // date should be in the past, get century cut-off year and adjust
      if (dateInPastConstraint && year) {
        const currentYear4digits = +new Date().toISOString().split('T')[0].split('-')[0];
        const currentCentury = currentYear4digits.toString().substring(0, 2);

        if (year.length === 4 && +year > currentYear4digits) {
          // e.g. the year "99" in a dateInPast setting is 1999 instead of 2099
          year = (+year - 100).toString();
        } else if (year.length === 2 && +(currentCentury + year) > currentYear4digits) {
          const lastCentury = +currentCentury - 1;
          year = lastCentury.toString() + year;
        }
      }

      return this.transformIncompleteDateIntoFormat(year, month, day, format, usesXForUnknown);
    }
    return '';
  }

  private transformIncompleteDateIntoFormat(year: string, month: string, day: string, format: string, useXForUnknown: boolean = false): string {
    if (!format) {
      format = this.defaultFormat;
    }
    let transformedDate = format;

    const yearForReplacement = this.getFormattedYear(year, format);
    transformedDate = transformedDate.replace(/[Yy]+/, yearForReplacement);


    const monthForReplacement = this.getFormattedMonth(month, format, useXForUnknown);
    transformedDate = transformedDate.replace(/[Mm]+/, monthForReplacement);


    const dayForReplacement = this.getFormattedDay(day, format, useXForUnknown);
    transformedDate = transformedDate.replace(/[Dd]+/, dayForReplacement);


    return transformedDate;
  }

  /**
   * Formats the day into the given format, adding a leading 0 if necessary.
   * Example: Day 8, Format DD-MM-YYYY -> Returns 08.
   *
   * If the day is falsy, 0 will be returned in the given format.
   * Example: Format D.M.YYYY -> Returns 0, DD.MM.YYYY -> Returns 00
   * @param day The day to be formatted
   * @param format The target format
   * @param useXForUnknown If true, use 'X' as a placeholder for unknown dates instead of '0'
   * @returns The formatted day in the given format
   */
  private getFormattedDay(day: string, format: string, useXForUnknown: boolean = false): string {
    let formattedDay = '';

    if (!format) {
      format = this.defaultFormat;
    }
    const match = /[Dd]+/.exec(format);
    if (!match) {
      throw new Error(
        'Es konnte kein \'D\' oder \'d\' im Format gefunden werden.'
        + 'Es handelt sich möglicherweise um eine Fehlkonfiguration.');
    }

    const formatOfDay = match[0];

    if (!day) {
      // if the day is not set, return placeholders for unknown day in the given format
      formatOfDay.split('').forEach(() => {
        formattedDay += useXForUnknown ? 'X' : '0';
      });
      return formattedDay;
    } else if (day.length < formatOfDay.length) {
      // if the dateformat has two characters for the day but the day is only one long
      return '0' + day;
    } else {
      return day;
    }
  }

  /**
   * Formats the month into the given format, adding a leading 0 if necessary.
   * Example: Month 4, Format DD-MM-YYYY -> Returns 04.
   *
   * If the month is falsy, 0 will be returned in the given format.
   * Example: Format D.M.YYYY -> Returns 0, DD.MM.YYYY -> Returns 00
   * @param month The month to be formatted
   * @param format The target format
   * @param useXForUnknown If true, use 'X' as a placeholder for unknown dates instead of '0'
   * @returns The formatted month in the given format
   */
  private getFormattedMonth(month: string, format: string, useXForUnknown: boolean = false): string {
    let formattedMonth = '';

    if (!format) {
      format = this.defaultFormat;
    }
    const match = /[Mm]+/.exec(format);
    if (!match) {
      throw new Error(
        'Es konnte kein \'M\' oder \'m\' im Format gefunden werden.'
        + 'Es handelt sich möglicherweise um eine Fehlkonfiguration.');
    }

    const formatOfMonth = match[0];

    if (!month) {
      // if the month is not set, return placeholders for unknown month in the given format
      formatOfMonth.split('').forEach(() => {
        formattedMonth += useXForUnknown ? 'X' : '0';
      });
      return formattedMonth;
    } else if (month.length < formatOfMonth.length) {
      // if the dateformat has two characters for the month but the month is only one long
      return '0' + month;
    } else {
      return month;
    }
  }

  /**
   * Formats the year into the given format.
   * Examples:
   * - Year 2017, Format DD.MM.YY -> 17
   * - Year 17, Format DD.MM.YYYY -> 2017
   * - Year 2017, Format DD.MM.YYYY -> 2017
   * - Year falsy, Format DD.MM.YYYY -> 0000
   * @param year The year to be formatted
   * @param format The target format
   * @returns The formatted year in the given format
   */
  private getFormattedYear(year: string, format: string): string {
    let formattedYear = '';

    if (!format) {
      format = this.defaultFormat;
    }
    const match = /[Yy]+/.exec(format);
    if (!match) {
      throw new Error(
        'Es konnte kein \'M\' oder \'m\' im Format gefunden werden.'
        + 'Es handelt sich möglicherweise um eine Fehlkonfiguration.');
    }

    const formatOfYear = match[0];

    if (!year) {
      // if the year is not set, return zeroes (0) in the given format
      formatOfYear.split('').forEach(() => {
        formattedYear += '0';
      });
      return formattedYear;
    } else if (year.length > formatOfYear.length) {
      // if the give format has only two characters for the year
      return year.slice(2);
    } else if (year.length < formatOfYear.length) {
      return '20' + year;
    } else {
      return year;
    }
  }
}
