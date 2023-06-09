import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private LOCALE = 'en-GB';
  private SEPARATOR = '/';
  private DOT = '.';

  convertToGermanDateFormat(date: string): string {
    return new Date(date).toLocaleDateString(this.LOCALE).split(this.SEPARATOR).join(this.DOT);
  }
}
