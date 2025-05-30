import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Route} from '@angular/router';
import {UserInfo} from '../api/userinfo';
import {Observable, of} from 'rxjs';
import {PermissionMaps} from './permission-maps';

/**
 * A service that can be configured with permission configuration and return permissions for certain elements.
 */
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private roles?: string[];
  private routeMap = new Map<string, string[]>();
  private elementMap = new Map<string, string[]>();

  /**
   * Sets the user the service will use
   * @param userInfo The user to use
   */
  setRoles(userInfo: UserInfo): void {
    this.roles = userInfo.roles;
  }

  /**
   * Sets the permission map the service will use
   * @param permissionJson The permission map to use
   */
  setPermissions(permissionJson: PermissionMaps): void {
    this.routeMap = new Map(Object.entries(permissionJson.routes));
    this.elementMap = new Map(Object.entries(permissionJson.elements));
  }

  /**
   * Checks permission for a given element
   * @param element The element to check permission for
   * @returns A boolean that contains whether permission for the given element is present
   */
  checkElementPermission(element: string): boolean {
    if (!this.roles) return false;

    const elementValue = this.elementMap.get(element);

    return elementValue?.some((role) => this.roles!.includes(role)) ?? false;
  }

  /**
   * Checks permission for a given route
   * @param route The route to check permission for
   * @returns An observable that eventually outputs a boolean whether the given route can be accessed
   */
  checkRoutePermission(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this.roles) return of(false);

    const spacer = route.url[0].path;
    const routeValue = this.routeMap.get(spacer);
    const hasAccess = routeValue?.some((role) => this.roles!.includes(role)) ?? false;

    return of(hasAccess);
  }

  /**
   * Checks loading permission for a given route, e.g. for lazy loading.
   * @param route The route to check permission for
   * @returns An observable that eventually outputs a boolean whether the given route can be loaded
   */
  checkLoadRoutePermission(route: Route): Observable<boolean> {
    if (!this.roles || !route.path) return of(false);

    const routeValue = this.routeMap.get(route.path);

    return of(routeValue?.some((role) => this.roles!.includes(role)) ?? false);
  }
}
