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
 * @param expectToBe Decides the usage of an existing or not existing route
 * builds an activated route snapshot
 * @returns an activated route snapshot object
 */
function buildSnapshot(expectToBe: boolean): ActivatedRouteSnapshot {
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.url = expectToBe ? [new UrlSegment('dashboard', {})] : [new UrlSegment('', {})];
  return snapshot;
}

describe('Integration Test: SecurityService', () => {
  let service: SecurityService;
  let spectator: SpectatorService<SecurityService>;
  const snapshot = buildSnapshot(true);
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

  beforeEach(() => {
    spectator = createdService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Integration Test: SecurityGuard - Unavailable roles and permissions', function () {
    it('should not access HTML element without roles and permissions', () => {
      const isElementPermitted = service.checkElementPermission('personenSuche');
      expect(isElementPermitted).toBeFalse();
    });

    it('should not access route without roles and permissions', () => {
      const isRoutePermittedObservable = service.checkRoutePermission(snapshot);
      isRoutePermittedObservable.subscribe((isRoutePermitted) => {
        expect(isRoutePermitted).toBeFalse();
      });
    });

    it('should not access async route without roles and permissions', () => {
      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeFalse();
      });
    });
  });

  describe('Integration Test: SecurityGuard - Available roles and permissions', function () {
    it('should access HTML element with correctly permissions', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isElementPermitted = service.checkElementPermission('personenSuche');
      expect(isElementPermitted).toBeTrue();
    });

    it('should not access the HTML element because the element was not found inside the permitted elements', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isElementPermitted = service.checkElementPermission('');
      expect(isElementPermitted).toBeFalse();
    });

    it('should route with correctly permissions', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isRoutePermittedObservable = service.checkRoutePermission(snapshot);
      isRoutePermittedObservable.subscribe((isRoutePermitted) => {
        expect(isRoutePermitted).toBeTrue();
      });
    });

    it('should not route because the route was not found inside the permitted routes', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const snapshotWithWrongRoute = buildSnapshot(false);
      const isRoutePermittedObservable = service.checkRoutePermission(snapshotWithWrongRoute);
      isRoutePermittedObservable.subscribe((isRoutePermitted) => {
        expect(isRoutePermitted).toBeFalse();
      });
    });

    it('should route async with correctly permissions', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeTrue();
      });
    });

    it('should not route async because no route is available', () => {
      const dummyRoute: Route = {title: 'dummy'};
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(dummyRoute);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeFalse();
      });
    });

    it('should not route async because the current role was not found', () => {
      setupRolesAndPermissions(service, {roles: ['wrong_role']}, permissionsData);
      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeFalse();
      });
    });
  });
});
