import {TestBed} from '@angular/core/testing';
import {SecurityService} from './security-service';
import {ActivatedRoute, Route} from '@angular/router';
import {AuthGuard} from 'isy-angular-widgets';
import {UserInfoPublicService} from '../../../../isy-angular-widgets-demo/src/app/core/user/userInfoPublicService';
import {of} from 'rxjs';
import SpyObj = jasmine.SpyObj;
import {PermissionMaps} from './permission-maps';

describe('SecurityGuard - without setting up roles and permissions', function() {
  let guard: AuthGuard;
  let activatedRoute: ActivatedRoute;
  let fakeCounterService: SpyObj<AuthGuard>;

  const route: Route = {
    title: 'Dashboard',
    path: 'dashboard'
  };

  const routeStateMock: any = { snapshot: {}, url: '/dashboard'};

  beforeEach(() => {
    fakeCounterService = jasmine.createSpyObj<AuthGuard>(
      'AuthGuard',
      {
        canActivate: of(false),
        canLoad: of(false)
      }
    );

    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        {provide: AuthGuard, useValue: fakeCounterService},
        SecurityService,
        UserInfoPublicService,
        {
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
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('cannot activate - no roles setup', () => {
    const canActivateObservable = guard.canActivate(activatedRoute.snapshot, routeStateMock);
    void canActivateObservable.forEach(canActivate => {
      expect(canActivate).toBeFalse();
    });
  });

  it('cannot load - no roles setup', () => {
    const canLoadObservable = guard.canLoad(route);
    void canLoadObservable.forEach(canBeLoaded => {
      expect(canBeLoaded).toBeFalse();
    });
  });
});

describe('SecurityGuard - with setting up roles and permissions', function() {
  let guard: AuthGuard;
  let activatedRoute: ActivatedRoute;
  let securityService: SecurityService;
  let userInfoPublicService: UserInfoPublicService;
  let fakeCounterService: SpyObj<AuthGuard>;

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

  const route: Route = {
    title: 'Dashboard',
    path: 'dashboard'
  };

  const routeStateMock: any = { snapshot: {}, url: '/dashboard'};

  beforeEach(() => {
    fakeCounterService = jasmine.createSpyObj<AuthGuard>(
      'AuthGuard',
      {
        canActivate: of(true),
        canLoad: of(true)
      }
    );

    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        {provide: AuthGuard, useValue: fakeCounterService},
        SecurityService,
        UserInfoPublicService,
        {
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
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    securityService = TestBed.inject(SecurityService);
    userInfoPublicService = TestBed.inject(UserInfoPublicService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    const userInfoData = userInfoPublicService.getUserInfo();
    securityService.setRoles(userInfoData);
    securityService.setPermissions(permissionsData);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('can activate - roles set up', () => {
    const canActivateObservable = guard.canActivate(activatedRoute.snapshot, routeStateMock);
    void canActivateObservable.forEach(canActivate => {
      expect(canActivate).toBeTrue();
    });
  });

  it('can load - roles setup', () => {
    const canLoadObservable = guard.canLoad(route);
    void canLoadObservable.forEach(canBeLoaded => {
      expect(canBeLoaded).toBeTrue();
    });
  });
});
