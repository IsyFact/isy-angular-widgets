import {createPipeFactory, SpectatorPipe} from '@ngneat/spectator';
import {IncompleteDatePipe} from './incomplete-date.pipe';

describe('Unit Tests: IncompleteDatePipe', () => {
  let spectator: SpectatorPipe<IncompleteDatePipe>;
  const createPipe = createPipeFactory(IncompleteDatePipe);

  const testCases = [
    {input: '2024-01-01', expected: '01.01.2024'},
    {input: 'XXXX-XX-XX', expected: 'xx.xx.xxxx'},
    {input: 'xxxx-xx-xx', expected: 'xx.xx.xxxx'},
    {input: '2024-xx-xx', expected: 'xx.xx.2024'},
    {input: '2024-01-xx', expected: 'xx.01.2024'},
    {input: '0000-00-00', expected: '00.00.0000'},
    {input: '2024-00-00', expected: '00.00.2024'},
    {input: '2024-01-00', expected: '00.01.2024'},
    {input: 'xx.xx.xxxx', expected: 'xx.xx.xxxx'},
    {input: '', expected: ''},
    {input: null, expected: ''},
    {input: undefined, expected: ''}
  ];

  testCases.forEach(({input, expected}) => {
    it(`should format "${input}" to "${expected}"`, () => {
      const testInput = !input && input !== '' ? input : `"${input}"`;
      spectator = createPipe(`{{ ${testInput} | incompleteDatePipe }}`);
      expect(spectator.element).toHaveText(expected);
    });
  });

  it('should throw an error for invalid date formats', () => {
    expect(() => {
      spectator = createPipe('{{ "invalid-date" | incompleteDatePipe }}');
    }).toThrow();
  });
});
