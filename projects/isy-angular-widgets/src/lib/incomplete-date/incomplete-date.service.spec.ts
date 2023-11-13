import {IncompleteDateService} from './incomplete-date.service';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

describe('Unit Tests: IsyIncompleteDate', () => {
  let spectator: SpectatorService<IncompleteDateService>;
  const createService = createServiceFactory(IncompleteDateService);

  beforeEach(() => (spectator = createService()));

  describe('transformValue', () => {
    it('should return a valid date in DD.00.YYYY format correctly', () => {
      expect(spectator.service.transformValue('01.01.2023')).toBe('01.01.2023');
    });

    it('should return a valid future date in DD.00.YYYY format correctly', () => {
      expect(spectator.service.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('should return an incomplete date in DD.00.YYYY format correctly', () => {
      expect(spectator.service.transformValue('00.01.2023')).toBe('00.01.2023');
    });

    it('should return an incomplete date in DD.00.YYYY format correctly', () => {
      expect(spectator.service.transformValue('00.00.2023')).toBe('00.00.2023');
    });

    it('should transform an incomplete date in DD.00.YYYY format correctly', () => {
      expect(spectator.service.transformValue('01.00.2023')).toBe('00.00.2023');
    });

    it('should transform an incomplete date with invalid day in DD.00.YYYY format correctly to 00.00.YYYY', () => {
      expect(spectator.service.transformValue('99.00.2023')).toBe('00.00.2023');
    });

    it('should transform an incomplete invalid date day in 00.MM.0000 format correctly to 00.00.0000', () => {
      expect(spectator.service.transformValue('00.01.0000')).toBe('00.00.0000');
    });

    it('should transform a valid future date in correctly DD.MM.YYYY format', () => {
      expect(spectator.service.transformValue('01.01.2024')).toBe('01.01.2024');
    });

    it('should transform an incomplete date in correctly 00.00.0000 format', () => {
      expect(spectator.service.transformValue('00.00.0000')).toBe('00.00.0000');
    });

    it('should transform a future date for DD.MM.YYYY', () => {
      expect(spectator.service.transformValue('01.01.9___')).toBe('01.01.2029');
    });

    it('should transform a future date for DD.MM.YYYY', () => {
      expect(spectator.service.transformValue('01.01.99__')).toBe('01.01.2099');
    });

    it('should transform a future date for DD.MM.YYYY', () => {
      expect(spectator.service.transformValue('01.01.999_')).toBe('01.01.2999');
    });

    it('should transform a past date for DD.MM.YYYY', () => {
      expect(spectator.service.transformValue('01.01.21__')).toBe('01.01.2021');
    });

    it('should transform a future date to past date year for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('01.01.9___', true)).toBe('01.01.2019');
    });

    it('should transform a future date to previous century for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('01.01.50__', true)).toBe('01.01.1950');
    });

    it('should transform a future date to previous century for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('01.01.999_', true)).toBe('01.01.1999');
    });

    it('should transform a past date for DD.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('01.01.03__', true)).toBe('01.01.2003');
    });
  });

  describe('transformValue (X for incomplete)', () => {
    it('should return an incomplete date in xx.MM.YYYY format correctly', () => {
      expect(spectator.service.transformValue('xx.01.2023')).toBe('xx.01.2023');
    });

    it('should transform an incomplete date in xD.MM.YYYY format correctly to xx.01.2023', () => {
      expect(spectator.service.transformValue('x1.01.2023')).toBe('xx.01.2023');
    });

    it('should transform an incomplete date in Dx.MM.YYYY format correctly to xx.01.2023', () => {
      expect(spectator.service.transformValue('1x.01.2023')).toBe('xx.01.2023');
    });

    it('should transform an incomplete date in DD.xx.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('01.xx.2023')).toBe('xx.xx.2023');
    });

    it('should return an incomplete date in xx.xx.YYYY format correctly', () => {
      expect(spectator.service.transformValue('xx.xx.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in xD.xx.YYYY format correctly', () => {
      expect(spectator.service.transformValue('x1.xx.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in Dx.xx.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('1x.xx.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in xx.xM.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('xx.x1.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in xx.Mx.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('xx.1x.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in xD.xM.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('x1.x1.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in Dx.Mx.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('1x.1x.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in Dx.xM.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('1x.x1.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in Dx.Mx.YYYY format correctly to xx.xx.2023', () => {
      expect(spectator.service.transformValue('x1.1x.2023')).toBe('xx.xx.2023');
    });

    it('should transform an incomplete date in DD.MM.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in xx.MM.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('xx.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in xD.MM.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('x1.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in Dx.MM.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('1x.01.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in DD.xx.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.xx.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in DD.xM.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.x1.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in DD.Mx.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.1x.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in xx.xM.xxxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('xx.x1.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in DD.MM.xxx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.01.xxx_')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in DD.MM.xx format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.01.xx__')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete date in xx.Mx.x format correctly to xx.xx.xxxx', () => {
      expect(spectator.service.transformValue('01.01.x___')).toBe('xx.xx.xxxx');
    });

    it('should return an incomplete date in xx.xx.xxxx format correctly', () => {
      expect(spectator.service.transformValue('xx.xx.xxxx')).toBe('xx.xx.xxxx');
    });

    it('should transform an incomplete future date in xx.MM.Y format correctly to xx.01.2029', () => {
      expect(spectator.service.transformValue('xx.01.9__')).toBe('xx.01.2029');
    });

    it('should transform an incomplete future date in xx.MM.YY format correctly to xx.01.2099', () => {
      expect(spectator.service.transformValue('xx.01.99__')).toBe('xx.01.2099');
    });

    it('should transform an incomplete future date in xx.MM.YYY format correctly to xx.01.2999', () => {
      expect(spectator.service.transformValue('xx.01.999_')).toBe('xx.01.2999');
    });

    it('should transform an incomplete future date in xx.xx.Y format correctly to xx.xx.2029', () => {
      expect(spectator.service.transformValue('xx.xx.9___')).toBe('xx.xx.2029');
    });

    it('should transform an incomplete future date in xx.xx.YY format correctly to xx.xx.2099', () => {
      expect(spectator.service.transformValue('xx.xx.99__')).toBe('xx.xx.2099');
    });

    it('should transform an incomplete future date in xx.xx.YYY format correctly to xx.xx.2999', () => {
      expect(spectator.service.transformValue('xx.xx.999_')).toBe('xx.xx.2999');
    });

    it('should transform an incomplete future date to past date year for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('xx.01.9___', true)).toBe('xx.01.2019');
    });

    it('should transform an incomplete future date to previous century for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('xx.01.50__', true)).toBe('xx.01.1950');
    });

    it('should transform an incomplete future date to previous century for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('xx.01.999_', true)).toBe('xx.01.1999');
    });

    it('should transform an incomplete future date for xx.MM.YYYY with dateInPastConstraint', () => {
      expect(spectator.service.transformValue('xx.01.03__', true)).toBe('xx.01.2003');
    });
  });
});
