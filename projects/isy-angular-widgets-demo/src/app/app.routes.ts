import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {PageNotFoundComponent} from './shared/errors/page-not-found/page-not-found.component';
import {dashboardRoutes} from './feature/dashboard/dashboard.routes';
import {objektAnzeigenRoutes} from './feature/objekt-anzeigen/objekt-anzeigen.routes';
import {primengWidgetsRoutes} from './feature/primeng-widgets/primeng-widgets.routes';

/**
 * Determines if a given route can be accessed
 * @param route Contains the information about a route associated with a component loaded in an outlet at a particular moment in time.
 * @returns An observable that eventually outputs a boolean whether the given route can be accessed
 */
function canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  return inject(AuthGuard).canActivate(route);
}

export const routes: Routes = [
  {
    path: 'dashboard',
    children: dashboardRoutes
  },
  ...objektAnzeigenRoutes,
  {
    path: 'objekt-suchen',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.searchObject'
    },
    loadComponent: async () => (await import('./feature/objekt-suchen/objekt-suchen.component')).ObjektSuchenComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'isy-angular-components',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.isyAngularComponents'
    },
    loadComponent: async () =>
      (await import('./feature/isy-angular-components/isy-angular-components.component')).IsyAngularComponentsComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  ...primengWidgetsRoutes,
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
