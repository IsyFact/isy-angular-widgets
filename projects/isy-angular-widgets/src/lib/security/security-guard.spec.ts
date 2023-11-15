import {SecurityService} from './security-service';
import {ActivatedRouteSnapshot, UrlSegment} from '@angular/router';
import {AuthGuard} from './security-guard';
import {createServiceFactory, createSpyObject, SpectatorService} from '@ngneat/spectator';

/**
 * builds an activated route snapshot
 * @returns an activated route snapshot object
 */
function buildSnapshot(): ActivatedRouteSnapshot {
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.url = [new UrlSegment('dashboard', {})];
  return snapshot;
}

const snapshot = buildSnapshot();

describe('Integration Test: SecurityGuard - without setting up roles and permissions', () => {
  let spectator: SpectatorService<AuthGuard>;
  const createdService = createServiceFactory(AuthGuard);

  beforeEach(() => (spectator = createdService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should not activate because no roles setup', () => {
    const canActivateObservable = spectator.service.canActivate(snapshot);
    void canActivateObservable.forEach((canActivate) => {
      expect(canActivate).toBeFalse();
    });
  });
});

describe('Integration Test: SecurityGuard - with setting up roles and permissions', () => {
  const securityServiceSpy = createSpyObject(SecurityService);
  securityServiceSpy.checkRoutePermission.andReturn(true);

  let spectator: SpectatorService<AuthGuard>;
  const createdService = createServiceFactory({
    service: AuthGuard,
    providers: [{provide: SecurityService, useValue: securityServiceSpy}]
  });

  beforeEach(() => (spectator = createdService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should activate - with roles set up', () => {
    const canActivateObservable = spectator.service.canActivate(snapshot);
    expect(canActivateObservable).toBeTrue();
  });
});
