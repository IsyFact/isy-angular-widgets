import {TestBed} from '@angular/core/testing';
import {SecurityService} from './security-service';
import {PermissionMaps} from './permission-maps';
import {UserInfo} from '../api/userinfo';
import {ActivatedRoute, Route} from '@angular/router';

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

describe('Integration Test: SecurityService', () => {
  let service: SecurityService;
  let activatedRoute: ActivatedRoute;
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

  const activatedRouteProvider = {
    provide: ActivatedRoute,
    useValue: {
      snapshot: {
        data: {
          title: 'Dashboard'
        },
        outlet: 'primary',
        routerConfig: {
          data: {
            title: 'Dashboard'
          },
          path: 'dashboard'
        },
        url: [
          {
            path: 'dashboard',
            parameters: {}
          }
        ]
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityService, activatedRouteProvider]
    });
    service = TestBed.inject(SecurityService);
    activatedRoute = TestBed.inject(ActivatedRoute);
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
      const isRoutePermittedObservable = service.checkRoutePermission(activatedRoute.snapshot);
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

    it('should route with correctly permissions', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isRoutePermittedObservable = service.checkRoutePermission(activatedRoute.snapshot);
      isRoutePermittedObservable.subscribe((isRoutePermitted) => {
        expect(isRoutePermitted).toBeTrue();
      });
    });

    it('should route async with correctly permissions', () => {
      setupRolesAndPermissions(service, userInfoData, permissionsData);
      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe((isLoadRoutePermitted) => {
        expect(isLoadRoutePermitted).toBeTrue();
      });
    });
  });
});
