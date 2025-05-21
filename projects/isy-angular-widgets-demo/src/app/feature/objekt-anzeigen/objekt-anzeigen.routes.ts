import {Routes, ActivatedRouteSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';

/**
 * Determines if a given route can be accessed
 * @param route Contains the information about a route associated with a component loaded in an outlet at a particular moment in time.
 * @returns An observable that eventually outputs a boolean whether the given route can be accessed
 */
function canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  return inject(AuthGuard).canActivate(route);
}

export const objektAnzeigenRoutes: Routes = [
  {
    path: 'objekt-anzeigen',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.displayObject'
    },
    loadComponent: async () => (await import('./objekt-anzeigen.component')).ObjektAnzeigenComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'objekt-anzeigen/:id',
    loadComponent: async () => (await import('./objekt-anzeigen.component')).ObjektAnzeigenComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  }
];
