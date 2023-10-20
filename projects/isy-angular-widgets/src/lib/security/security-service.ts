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
  private routeMap: Map<string, string[]> = new Map();
  private elementMap: Map<string, string[]> = new Map();

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
    if (!this.roles) {
      return false;
    }
    const elementValue = this.elementMap.get(element);
    for (const role of this.roles) {
      if (elementValue?.includes(role)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks permission for a given route
   * @param route The route to check permission for
   * @returns An observable that eventually outputs a boolean whether the given route can be accessed
   */
  checkRoutePermission(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this.roles) {
      return of(false);
    }

    const spacer = route.url[0].path;
    const routeValue = this.routeMap.get(spacer);
    for (const role of this.roles) {
      if (routeValue?.includes(role)) {
        return of(true);
      }
    }
    return of(false);
  }

  /**
   * Checks loading permission for a given route, e.g. for lazy loading.
   * @param route The route to check permission for
   * @returns An observable that eventually outputs a boolean whether the given route can be loaded
   */
  checkLoadRoutePermission(route: Route): Observable<boolean> {
    if (!this.roles) {
      return of(false);
    }
    if (!route.path) {
      return of(false);
    }
    const routeValue = this.routeMap.get(route.path);
    for (const role of this.roles) {
      if (routeValue?.includes(role)) {
        return of(true);
      }
    }
    return of(false);
  }
}
