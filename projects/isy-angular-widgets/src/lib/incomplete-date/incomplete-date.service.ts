/* eslint-disable @typescript-eslint/no-magic-numbers */

import {Injectable} from '@angular/core';

export interface DateObject {
  day: string;
  month: string;
  year: string;
}

/**
 * Performs transformations from incomplete dates into german date format DD.MM.YYYY
 */
@Injectable({
  providedIn: 'root'
})
export class IncompleteDateService {

  /**
   * If the new date is a valid or incomplete date it should be transformed
   * into the german date format. Otherwise, return it empty.
   * @param newValue Value to be transformed
   * @param dateInPastConstraint If true, the date should be in the past
   * @returns The transformed date in the german date format
   */
  transformValue(newValue: string, dateInPastConstraint = false): string {
    let dateStr = newValue;
    const [day, month, year] = dateStr.split('.');
    let partYear = `${year}`.replace(/_/g, '');

    // e.g. the year "99" in a dateInPast setting is 1999 instead of 2099
    if (partYear.length < 4 && !partYear.includes('x')) {
      const currentYear: number = new Date().getFullYear();
      const numX = 10 ** partYear.length;
      partYear = currentYear.toString().slice(0, -partYear.length).concat(partYear);
      partYear = (Number(partYear) > currentYear) && dateInPastConstraint ? (Number(partYear)-numX).toString() : Number(partYear).toString();
      dateStr = [`${day}`, `${month}`, partYear].join('.');
    } 

    if (this.dateIsUnspecified(dateStr)) dateStr = this.getIncompleteDate(dateStr);

    return dateStr;
  }

  /**
   * Takes an incomplete date and transforms it into the german date format.
   * Example: x1.x1.1999 -> xx.xx.1999
   * @param date Date as a string
   * @returns The transformed date in the german date format
   */
  private getIncompleteDate(date: string): string {
    const formats = date.split('.');
    const dateKeys = ['day', 'month', 'year'];

    const dateObject = dateKeys.reduce((object: Object, element: string, index: number) => {
      let partOfFormat = formats[index];

      if (partOfFormat.includes('x')) {
        partOfFormat = 'x'.repeat(partOfFormat.length);
      } 

      return { ...object, [element]: partOfFormat };
    }, {}) as DateObject;

    const dateStr = Object.values(dateObject).join('.');

    const regex = /^(0{2}\.x{2}\.\d{4})|(x{2}\.0{2}\.\d{4})$/;
    
    if (dateStr.match(regex) !== null || dateObject.month.includes('x') || dateObject.year.includes('x')) return 'xx.xx.' + dateObject.year;
    
    if (dateObject.month === '00' || dateObject.year === '0000') return '00.00.' + dateObject.year;
    
    return dateStr;
  }

  /**
   * Check if the date in date format DD.MM.YYYY is unspecified or not
   * @param dateStr Date as a string
   * @returns True or false as a boolean
   */
  private dateIsUnspecified(dateStr: string): boolean {
    const regex = /^(0{2}\.\d{2}\.\d{4})|(\d{2}\.0{2}\.\d{4})$/;

    return (!(dateStr.match(regex) === null && dateStr.match('x') === null));
  }
}
