import {createPipeFactory, SpectatorPipe} from '@ngneat/spectator';
import {IncompleteDatePipe} from './incomplete-date.pipe';

describe('Unit Tests: IncompleteDatePipe', () => {
  let spectator: SpectatorPipe<IncompleteDatePipe>;
  const createPipe = createPipeFactory(IncompleteDatePipe);

  it('should format "2024-01-01" to "01.01.2024"', () => {
    spectator = createPipe('{{ "2024-01-01" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('01.01.2024');
  });

  it('should format incomplete dates in uppercase like "XXXX-XX-XX"', () => {
    spectator = createPipe('{{ "XXXX-XX-XX" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('xx.xx.xxxx');
  });

  it('should format incomplete dates like "xxxx-xx-xx"', () => {
    spectator = createPipe('{{ "xxxx-xx-xx" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('xx.xx.xxxx');
  });

  it('should format incomplete dates like "2024-xx-xx"', () => {
    spectator = createPipe('{{ "2024-xx-xx" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('xx.xx.2024');
  });

  it('should format incomplete dates like "2024-01-xx"', () => {
    spectator = createPipe('{{ "2024-01-xx" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('xx.01.2024');
  });

  it('should format incomplete dates like "0000-00-00"', () => {
    spectator = createPipe('{{ "0000-00-00" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('00.00.0000');
  });

  it('should format incomplete dates like "2024-00-00"', () => {
    spectator = createPipe('{{ "2024-00-00" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('00.00.2024');
  });

  it('should format incomplete dates like "2024-01-00"', () => {
    spectator = createPipe('{{ "2024-01-00" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('00.01.2024');
  });

  it('should throw an error for invalid date formats', () => {
    expect(() => {
      spectator = createPipe('{{ "invalid-date" | incompleteDatePipe }}');
    }).toThrow();
  });

  it('should return an empty string for empty input', () => {
    spectator = createPipe('{{ "" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('');
  });

  it('should return an empty string for null input', () => {
    spectator = createPipe('{{ null | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('');
  });

  it('should return an empty string for undefined input', () => {
    spectator = createPipe('{{ undefined | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('');
  });

  it('should return the same date string in lowercase if in German format', () => {
    spectator = createPipe('{{ "xx.xx.xxxx" | incompleteDatePipe }}');
    expect(spectator.element).toHaveText('xx.xx.xxxx');
  });
});
