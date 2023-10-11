import {TestBed} from '@angular/core/testing';
import {SecurityService} from './security-service';
import {UserInfoPublicService} from '../../../../isy-angular-widgets-demo/src/app/core/user/userInfoPublicService';
import {PermissionMaps} from './permission-maps';
import {UserInfo} from '../api/userinfo';
import {ActivatedRoute, Route} from '@angular/router';

/**
 *
 * @param service The service whow must be used
 * @param userInfoData Data who is including the roles and coming from the userinfo endpoint
 * @param permissionsData Data who is including the permissions
 */
function setupRolesAndPermissions(service: SecurityService, userInfoData: UserInfo, permissionsData: PermissionMaps): void {
  service.setRoles(userInfoData);
  service.setPermissions(permissionsData);
}

describe('Integration Test: SecurityService', () => {
  let service: SecurityService;
  let userInfoService: UserInfoPublicService;
  let activatedRoute: ActivatedRoute;
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
      providers: [
        SecurityService,
        UserInfoPublicService,
        activatedRouteProvider
      ]
    });
    service = TestBed.inject(SecurityService);
    userInfoService = TestBed.inject(UserInfoPublicService);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Integration Test: SecurityGuard - Unavailable roles and permissions', function() {
    it('should not access element without roles and permissions', () => {
      const isElementPermitted = service.checkElementPermission('personenSuche');
      expect(isElementPermitted).toBeFalse();

      const isRoutePermittedObservable = service.checkRoutePermission(activatedRoute.snapshot);
      isRoutePermittedObservable.subscribe(isRoutePermitted => {
        expect(isRoutePermitted).toBeFalse();
      });

      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe(isLoadRoutePermitted => {
        expect(isLoadRoutePermitted).toBeFalse();
      });
    });
  });

  describe('Integration Test: SecurityGuard - Available roles and permissions', function() {
    it('should access element with correctly permissions', () => {
      const userInfoData = userInfoService.getUserInfo();
      setupRolesAndPermissions(service, userInfoData, permissionsData);

      const isElementPermitted = service.checkElementPermission('personenSuche');
      expect(isElementPermitted).toBeTrue();

      const isRoutePermittedObservable = service.checkRoutePermission(activatedRoute.snapshot);
      isRoutePermittedObservable.subscribe(isRoutePermitted => {
        expect(isRoutePermitted).toBeTrue();
      });

      const isLoadRoutePermittedObservable = service.checkLoadRoutePermission(route);
      isLoadRoutePermittedObservable.subscribe(isLoadRoutePermitted => {
        expect(isLoadRoutePermitted).toBeTrue();
      });
    });
  });
});
