import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly LOCALE = 'en-GB';
  private readonly SEPARATOR = '/';
  private readonly DOT = '.';

  convertToGermanDateFormat(date: string): string {
    return new Date(date).toLocaleDateString(this.LOCALE).split(this.SEPARATOR).join(this.DOT);
  }
}
