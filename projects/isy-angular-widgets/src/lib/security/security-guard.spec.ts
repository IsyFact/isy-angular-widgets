import {TestBed} from '@angular/core/testing';
import {SecurityService} from './security-service';
import {ActivatedRoute} from '@angular/router';
import {AuthGuard} from './security-guard';
import {of} from 'rxjs';
import SpyObj = jasmine.SpyObj;
import {PermissionMaps} from './permission-maps';
import {UserInfo} from '../api/userinfo';

let guard: AuthGuard;
let activatedRoute: ActivatedRoute;
let securityService: SecurityService;
let fakeCounterService: SpyObj<AuthGuard>;
const activatedRouteProvider = {
  provide: ActivatedRoute,
  useValue: {
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
        parameters: {},
        path: 'dashboard'
      }
    ]
  }
};

/**
 * Setting up the fake counter service
 * @param canActivate The canActivate value
 */
function setupFakeCounterService(canActivate: boolean): void {
  fakeCounterService = jasmine.createSpyObj<AuthGuard>('AuthGuard', {
    canActivate: of(canActivate)
  });
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

describe('Integration Test: SecurityGuard - without setting up roles and permissions', function () {
  beforeEach(() => {
    setupFakeCounterService(false);
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [{provide: AuthGuard, useValue: fakeCounterService}, SecurityService, activatedRouteProvider]
    });

    guard = TestBed.inject(AuthGuard);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should not activate because no roles setup', () => {
    const canActivateObservable = guard.canActivate(activatedRoute.snapshot);
    void canActivateObservable.forEach((canActivate) => {
      expect(canActivate).toBeFalse();
    });
  });
});

describe('Integration Test: SecurityGuard - with setting up roles and permissions', function () {
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

  beforeEach(() => {
    setupFakeCounterService(true);
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [{provide: AuthGuard, useValue: fakeCounterService}, SecurityService, activatedRouteProvider]
    });

    guard = TestBed.inject(AuthGuard);
    securityService = TestBed.inject(SecurityService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    const userInfoData = getUserInfo();
    securityService.setRoles(userInfoData);
    securityService.setPermissions(permissionsData);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate - with roles set up', () => {
    const canActivateObservable = guard.canActivate(activatedRoute.snapshot);
    void canActivateObservable.forEach((canActivate) => {
      expect(canActivate).toBeTrue();
    });
  });
});
