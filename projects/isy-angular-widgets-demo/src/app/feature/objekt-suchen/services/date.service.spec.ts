import {DateService} from './date.service';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

describe('Unit Tests: DateService', () => {
  const DOT = '.';
  const format = 'dd.mm.yyyy';
  const convertedDate = '01.01.1337';
  const unconvertedDate = 'Wed Jan 01 1337 12:00:00 GMT+0053 (Mitteleuropäische Normalzeit)';

  let spectator: SpectatorService<DateService>;
  const createdService = createServiceFactory(DateService);

  beforeEach(() => (spectator = createdService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should be in german date format', () => {
    const expected = spectator.service.convertToGermanDateFormat(unconvertedDate);
    expect(convertedDate).toEqual(expected);

    const firstDot = expected.substring(2, 3);
    expect(firstDot).toEqual(DOT);

    const secondDot = expected.substring(5, 6);
    expect(secondDot).toEqual(DOT);

    expect(format.length).toEqual(expected.length);
  });
});
