import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {PageNotFoundComponent} from './shared/errors/page-not-found/page-not-found.component';

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
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.dashboard'
    },
    loadChildren: async () => (await import('./feature/dashboard/dashboard.module')).DashboardModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'objekt-anzeigen',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.displayObject'
    },
    loadChildren: async () => (await import('./feature/objekt-anzeigen/objekt-anzeigen.module')).ObjektAnzeigenModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'objekt-suchen',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.searchObject'
    },
    loadChildren: async () => (await import('./feature/objekt-suchen/objekt-suchen.module')).ObjektSuchenModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
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
