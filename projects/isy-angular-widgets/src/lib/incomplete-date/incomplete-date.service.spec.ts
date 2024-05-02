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
      {description: 'valid date', inputVal: '01.01.2023', expected: '01.01.2023'},
      {description: 'valid future date', inputVal: '01.01.2024', expected: '01.01.2024'},
      {description: 'incomplete date with valid month', inputVal: '00.01.2023', expected: '00.01.2023'},
      {description: 'incomplete date with zero month and day', inputVal: '00.00.2023', expected: '00.00.2023'},
      {description: 'incomplete date with zero month', inputVal: '01.00.2023', expected: '00.00.2023'},
      {description: 'invalid day transformation', inputVal: '99.00.2023', expected: '00.00.2023'},
      {description: 'zero day and month in year 0000', inputVal: '00.01.0000', expected: '00.00.0000'},
      {description: 'fully valid future date', inputVal: '01.01.2024', expected: '01.01.2024'},
      {description: 'fully zero date', inputVal: '00.00.0000', expected: '00.00.0000'},
      {description: 'future date with placeholders for year', inputVal: '01.01.9___', expected: '01.01.2029'},
      {description: 'future date with more placeholders', inputVal: '01.01.99__', expected: '01.01.2099'},
      {description: 'near millennium future date', inputVal: '01.01.999_', expected: '01.01.2999'},
      {description: 'past date with placeholders', inputVal: '01.01.21__', expected: '01.01.2021'},
      {
        description: 'future to past date conversion with constraint',
        inputVal: '01.01.9___',
        expected: '01.01.2019',
        options: true
      },
      {
        description: 'future date to previous century with constraint',
        inputVal: '01.01.50__',
        expected: '01.01.1950',
        options: true
      },
      {
        description: 'future to last century end with constraint',
        inputVal: '01.01.999_',
        expected: '01.01.1999',
        options: true
      },
      {description: 'early 2000s with constraint', inputVal: '01.01.03__', expected: '01.01.2003', options: true}
    ];

    testCases.forEach(({description, inputVal, options, expected}) => {
      it(`${description}: should transform ${inputVal} using options: ${options} to ${expected}`, () => {
        expect(service.transformValue(inputVal, options)).toBe(expected);
      });
    });
  });

  describe('transformValue (X for incomplete)', () => {
    const testCases = [
      {description: 'retain placeholders in day and month', inputVal: 'xx.01.2023', expected: 'xx.01.2023'},
      {description: 'transform single placeholder in day to x', inputVal: 'x1.01.2023', expected: 'xx.01.2023'},
      {description: 'transform single placeholder in day reverse to x', inputVal: '1x.01.2023', expected: 'xx.01.2023'},
      {description: 'transform single placeholder in month to x', inputVal: '01.xx.2023', expected: 'xx.xx.2023'},
      {description: 'retain double placeholders in both day and month', inputVal: 'xx.xx.2023', expected: 'xx.xx.2023'},
      {
        description: 'transform single placeholder in day with month as placeholder',
        inputVal: 'x1.xx.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform single placeholder in day reverse with month as placeholder',
        inputVal: '1x.xx.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform single placeholder in month with day as placeholder',
        inputVal: 'xx.x1.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform single placeholder in month reverse with day as placeholder',
        inputVal: 'xx.1x.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform placeholders in both day parts and month',
        inputVal: 'x1.x1.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform placeholders in both day reverse and month reverse',
        inputVal: '1x.1x.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform placeholder in day reverse and single month',
        inputVal: '1x.x1.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'transform placeholder in day and single month reverse',
        inputVal: 'x1.1x.2023',
        expected: 'xx.xx.2023'
      },
      {
        description: 'all placeholders in year with valid day and month',
        inputVal: '01.01.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'all placeholders in year with placeholders in day and month',
        inputVal: 'xx.01.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'transform single placeholder in day with full placeholders in year',
        inputVal: 'x1.01.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'transform single placeholder in day reverse with full placeholders in year',
        inputVal: '1x.01.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'all placeholders in month with valid day and full placeholders in year',
        inputVal: '01.xx.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'all placeholders in month part with valid day and year',
        inputVal: '01.x1.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'transform single placeholder in month reverse with valid day and year',
        inputVal: '01.1x.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {
        description: 'transform single placeholder in month part with day as placeholders and year',
        inputVal: 'xx.x1.xxxx',
        expected: 'xx.xx.xxxx'
      },
      {description: 'year with one missing character', inputVal: '01.01.xxx_', expected: 'xx.xx.xxxx'},
      {description: 'year with two missing characters', inputVal: '01.01.xx__', expected: 'xx.xx.xxxx'},
      {description: 'all placeholders in date with year as xxxx', inputVal: 'xx.xx.xxxx', expected: 'xx.xx.xxxx'},
      {description: 'transform partial future year', inputVal: 'xx.01.9__', expected: 'xx.01.2029'},
      {description: 'transform more of future year', inputVal: 'xx.01.99__', expected: 'xx.01.2099'},
      {description: 'transform near full future millennium', inputVal: 'xx.01.999_', expected: 'xx.01.2999'},
      {
        description: 'all placeholders in date with near future millennium',
        inputVal: 'xx.xx.9___',
        expected: 'xx.xx.2029'
      },
      {
        description: 'all placeholders in date with more of future century',
        inputVal: 'xx.xx.99__',
        expected: 'xx.xx.2099'
      },
      {
        description: 'all placeholders in date with near full future millennium',
        inputVal: 'xx.xx.999_',
        expected: 'xx.xx.2999'
      },
      {
        description: 'past date due to constraints with future year as placeholder',
        inputVal: 'xx.01.9___',
        expected: 'xx.01.2019',
        options: true
      },
      {
        description: 'transform to previous century with past constraints',
        inputVal: 'xx.01.50__',
        expected: 'xx.01.1950',
        options: true
      },
      {
        description: 'transform to previous century end due to constraints',
        inputVal: 'xx.01.999_',
        expected: 'xx.01.1999',
        options: true
      },
      {
        description: 'transform to early 2000s with past constraints',
        inputVal: 'xx.01.03__',
        expected: 'xx.01.2003',
        options: true
      }
    ];

    testCases.forEach(({description, inputVal, options, expected}) => {
      it(`${description}: should transform ${inputVal} using options: ${options} to ${expected}`, () => {
        expect(service.transformValue(inputVal, options)).toBe(expected);
      });
    });
  });
});
