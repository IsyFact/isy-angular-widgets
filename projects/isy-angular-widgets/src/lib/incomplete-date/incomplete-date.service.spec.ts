import {IncompleteDateService} from './incomplete-date.service';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

describe('Unit Tests: IncompleteDateService', () => {
  let service: IncompleteDateService;
  let spectator: SpectatorService<IncompleteDateService>;
  const createService = createServiceFactory(IncompleteDateService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('transformValue', () => {
    const testCases = [
      {inputVal: '01.01.2023', expected: '01.01.2023'},
      {inputVal: '01.01.2999', expected: '01.01.2999'},
      {inputVal: '00.01.2023', expected: '00.01.2023'},
      {inputVal: '00.00.2023', expected: '00.00.2023'},
      {inputVal: '01.00.2023', expected: '00.00.2023'},
      {inputVal: '99.00.2023', expected: '00.00.2023'},
      {inputVal: '00.01.0000', expected: '00.00.0000'},
      {inputVal: '00.00.0000', expected: '00.00.0000'},
      {inputVal: '01.01.9___', expected: '01.01.2029'},
      {inputVal: '01.01.99__', expected: '01.01.2099'},
      {inputVal: '01.01.999_', expected: '01.01.2999'},
      {inputVal: '01.01.21__', expected: '01.01.2021'},
      {inputVal: '01.01.9___', expected: '01.01.2019', options: true},
      {inputVal: '01.01.50__', expected: '01.01.1950', options: true},
      {inputVal: '01.01.999_', expected: '01.01.1999', options: true},
      {inputVal: '01.01.03__', expected: '01.01.2003', options: true}
    ];

    testCases.forEach(({inputVal, expected, options}) => {
      const description = `${inputVal} ${options ? 'with options' : ''} should transform to ${expected}`;
      it(description, () => {
        expect(service.transformValue(inputVal, options)).toBe(expected);
      });
    });
  });

  describe('transformValue (X for incomplete)', () => {
    const testCases = [
      {inputVal: 'xx.01.2023', expected: 'xx.01.2023'},
      {inputVal: 'x1.01.2023', expected: 'xx.01.2023'},
      {inputVal: '1x.01.2023', expected: 'xx.01.2023'},
      {inputVal: '01.xx.2023', expected: 'xx.xx.2023'},
      {inputVal: 'xx.xx.2023', expected: 'xx.xx.2023'},
      {inputVal: 'x1.xx.2023', expected: 'xx.xx.2023'},
      {inputVal: '1x.xx.2023', expected: 'xx.xx.2023'},
      {inputVal: 'xx.x1.2023', expected: 'xx.xx.2023'},
      {inputVal: 'xx.1x.2023', expected: 'xx.xx.2023'},
      {inputVal: 'x1.x1.2023', expected: 'xx.xx.2023'},
      {inputVal: '1x.1x.2023', expected: 'xx.xx.2023'},
      {inputVal: '1x.x1.2023', expected: 'xx.xx.2023'},
      {inputVal: 'x1.1x.2023', expected: 'xx.xx.2023'},
      {inputVal: '01.01.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: 'xx.01.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: 'x1.01.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: '1x.01.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: '01.xx.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: '01.x1.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: '01.1x.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: 'xx.x1.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: '01.01.xxx_', expected: 'xx.xx.xxxx'},
      {inputVal: '01.01.xx__', expected: 'xx.xx.xxxx'},
      {inputVal: '01.01.x___', expected: 'xx.xx.xxxx'},
      {inputVal: 'xx.xx.xxxx', expected: 'xx.xx.xxxx'},
      {inputVal: 'xx.01.9__', expected: 'xx.01.2029'},
      {inputVal: 'xx.01.99__', expected: 'xx.01.2099'},
      {inputVal: 'xx.01.999_', expected: 'xx.01.2999'},
      {inputVal: 'xx.xx.9___', expected: 'xx.xx.2029'},
      {inputVal: 'xx.xx.99__', expected: 'xx.xx.2099'},
      {inputVal: 'xx.xx.999_', expected: 'xx.xx.2999'},
      {inputVal: 'xx.01.9___', expected: 'xx.01.2019', options: true},
      {inputVal: 'xx.01.50__', expected: 'xx.01.1950', options: true},
      {inputVal: 'xx.01.999_', expected: 'xx.01.1999', options: true},
      {inputVal: 'xx.01.03__', expected: 'xx.01.2003', options: true}
    ];

    testCases.forEach(({inputVal, options, expected}) => {
      const description = `should transform ${inputVal} ${options ? 'with options' : ''} to ${expected}`;
      it(description, () => {
        expect(service.transformValue(inputVal, options)).toBe(expected);
      });
    });
  });
});
