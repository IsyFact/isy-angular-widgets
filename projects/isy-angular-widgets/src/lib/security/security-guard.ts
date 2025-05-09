import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SecurityService} from './security-service';

/**
 * An AuthGuard that can check whether certain routes can be loaded or activated with current permissions.
 * Can e.g. be used in app-routing-module:
 *
 *
 *   {
 *     path: 'personen',
 *     canLoad: [AuthGuard]
 *   }
 */
@Injectable({providedIn: 'root'})
export class AuthGuard {
  /**
   * @param securityService A service that can be configured with permission configuration and return permissions for certain elements.
   * @internal
   */
  constructor(private readonly securityService: SecurityService) {}

  /**
   * Determines if a given route can be accessed
   * @param route The route to check
   * @returns An observable that eventually outputs a boolean whether the given route can be accessed
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.securityService.checkRoutePermission(route);
  }
}
