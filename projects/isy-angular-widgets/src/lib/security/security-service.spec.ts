import {SecurityService} from './security-service';
import {PermissionMaps} from './permission-maps';
import {UserInfo} from '../api/userinfo';
import {ActivatedRoute, ActivatedRouteSnapshot, Route, UrlSegment} from '@angular/router';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

/**
 *
 * @param service The service whow must be used
 * @param userInfoData Data who is including the roles and coming from the userinfo endpoint
 * @param permissionsData Data who is including the permissions
 */
function setupRolesAndPermissions(
  service: SecurityService,
  userInfoData: UserInfo,
  permissionsData: PermissionMaps
): void {
  service.setRoles(userInfoData);
  service.setPermissions(permissionsData);
}

/**
 *  Returns needed logged-in user info data
 *  @returns an object with logged-in user info
 */
function getUserInfo(): UserInfo {
  return {
    userId: '1',
    roles: ['admin', 'user'],
    displayName: 'Nutzer'
  };
}

/**
 * builds an activated route snapshot
 * @returns an activated route snapshot object
 */
function buildSnapshot(): ActivatedRouteSnapshot {
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.url = [new UrlSegment('dashboard', {})];
  return snapshot;
}

describe('Integration Test: SecurityService', () => {
  let spectator: SpectatorService<SecurityService>;
  const snapshot = buildSnapshot();
  const userInfoData = getUserInfo();
  const route: Route = {
    title: 'Dashboard',
    path: 'dashboard'
  };

  const permissionsData: PermissionMaps = {
    elements: {
      personenSuche: ['admin', 'user'],
      secretFieldsInputSwitch: ['admin']
    },
    routes: {
      personen: ['admin', 'user'],
      dashboard: ['admin', 'user']
    }
  };

  const createdService = createServiceFactory({
    service: SecurityService,
    providers: [{provide: ActivatedRoute, useValue: {}}]
  });

  beforeEach(() => spectator = createdService());

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('Integration Test: SecurityGuard - Unavailable roles and permissions', function () {
    it('should not access HTML element without roles and permissions', () => {
      const isElementPermitted = spectator.service.checkElementPermission('personenSuche');
      expect(isElementPermitted).toBeFalse();
    });

    it('should not access route without roles and permissions', () => {
      const isRoutePermittedObservable = spectator.service.checkRoutePermission(snapshot);
      isRoutePermittedObservable.subscribe((isRoutePermitted) => {
        expect(isRoutePermitted).toBeFalse();
      });
    });

    it('should not access async route without roles and permissions', () => {
      const isLoadRoutePermittedObservable = spectator.service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeFalse();
      });
    });
  });

  describe('Integration Test: SecurityGuard - Available roles and permissions', function () {
    it('should access HTML element with correctly permissions', () => {
      setupRolesAndPermissions(spectator.service, userInfoData, permissionsData);
      const isElementPermitted = spectator.service.checkElementPermission('personenSuche');
      expect(isElementPermitted).toBeTrue();
    });

    it('should route with correctly permissions', () => {
      setupRolesAndPermissions(spectator.service, userInfoData, permissionsData);
      const isRoutePermittedObservable = spectator.service.checkRoutePermission(snapshot);
      isRoutePermittedObservable.subscribe((isRoutePermitted) => {
        expect(isRoutePermitted).toBeTrue();
      });
    });

    it('should route async with correctly permissions', () => {
      setupRolesAndPermissions(spectator.service, userInfoData, permissionsData);
      const isLoadRoutePermittedObservable = spectator.service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeTrue();
      });
    });
  });
});
