import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {of, from, isObservable, Observable} from 'rxjs';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';
import {canActivateAuth} from './auth.guard';

describe('canActivateAuth (functional guard)', () => {
  let mockAuthGuard: jasmine.SpyObj<AuthGuard>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Converts a value, promise, or observable into an Observable.
   * @template T - The type of the value to be wrapped.
   * @param value - The value to convert. Can be a plain value, a Promise, or an Observable.
   * @returns An Observable that emits the provided value or the result of the promise.
   */
  function toObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
    if (isObservable(value)) return value;
    if (value instanceof Promise) return from(value);
    return of(value);
  }

  beforeEach(() => {
    mockAuthGuard = jasmine.createSpyObj<AuthGuard>('AuthGuard', ['canActivate']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthGuard, useValue: mockAuthGuard},
        {provide: Router, useValue: mockRouter}
      ]
    });
  });

  it('should return true when AuthGuard allows activation', async () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    mockAuthGuard.canActivate.and.returnValue(of(true));

    const result = await TestBed.runInInjectionContext(async () => canActivateAuth(route, state));

    toObservable(result).subscribe((res) => {
      expect(res).toBeTrue();
      expect(mockAuthGuard.canActivate).toHaveBeenCalledWith(route);
    });
  });

  it('should return false when AuthGuard denies activation', async () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    mockAuthGuard.canActivate.and.returnValue(of(false));

    const result = await TestBed.runInInjectionContext(async () => canActivateAuth(route, state));

    toObservable(result).subscribe((res) => {
      expect(res).toBeFalse();
      expect(mockAuthGuard.canActivate).toHaveBeenCalledWith(route);
    });
  });
});
