import { TestBed } from '@angular/core/testing';

import { DateService } from './date.service';

describe('DateService', () => {
  const DOT = '.';
  const format = 'dd.mm.yyyy';
  const convertedDate = '01.01.1337';
  const unconvertedDate = 'Wed Jan 01 1337 12:00:00 GMT+0053 (Mitteleuropäische Normalzeit)';

  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check the german date format', () => {
    const expected = service.convertToGermanDateFormat(unconvertedDate);
    expect(convertedDate).toEqual(expected);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const firstDot = expected.substring(2, 3);
    expect(firstDot).toEqual(DOT);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const secondDot = expected.substring(5, 6);
    expect(secondDot).toEqual(DOT);

    expect(format.length).toEqual(expected.length);
  });
});
