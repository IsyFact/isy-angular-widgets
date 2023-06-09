/**
 * Contains an array of roles that can access specific elements or routes.
 */
export interface PermissionMaps {

  /**
   * A list of elements and associated roles that can access that element.
   */
  elements: { [key: string]: string[] };

  /**
   * A list of routes and associated roles that can access that route.
   */
  routes: { [key: string]: string[] };
}
