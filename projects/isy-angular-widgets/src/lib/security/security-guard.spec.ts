import {SecurityService} from './security-service';
import {ActivatedRoute, ActivatedRouteSnapshot, UrlSegment} from '@angular/router';
import {AuthGuard} from './security-guard';
import {of} from 'rxjs';
import {PermissionMaps} from './permission-maps';
import {UserInfo} from '../api/userinfo';
import SpyObj = jasmine.SpyObj;
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {TestBed} from '@angular/core/testing';

let fakeCounterService: SpyObj<AuthGuard>;

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

/**
 * builds an activated route snapshot
 * @returns an activated route snapshot object
 */
function buildSnapshot(): ActivatedRouteSnapshot {
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.url = [new UrlSegment('dashboard', {})];
  return snapshot;
}

let securityService: SecurityService;
const snapshot = buildSnapshot();
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

describe('Integration Test: SecurityGuard - without setting up roles and permissions', function () {
  let spectator: SpectatorService<AuthGuard>;
  const createdService = createServiceFactory({
    service: AuthGuard,
    providers: [{provide: AuthGuard, useValue: {}}]
  });

  beforeEach(() => spectator = createdService());

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

describe('Integration Test: SecurityGuard - with setting up roles and permissions', function () {
  let guard: AuthGuard;
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

    const userInfoData = getUserInfo();
    securityService.setRoles(userInfoData);
    securityService.setPermissions(permissionsData);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate - with roles set up', () => {
    const canActivateObservable = guard.canActivate(snapshot);
    void canActivateObservable.forEach((canActivate) => {
      expect(canActivate).toBeTrue();
    });
  });
});
