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

export const primengWidgetsRoutes: Routes = [
  {
    path: 'primeng-widgets/primeng-button',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengButton'
    },
    loadComponent: async () =>
      (await import('./components/primeng-button/primeng-button.component')).PrimengButtonComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-chart',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengChart'
    },
    loadComponent: async () =>
      (await import('./components/primeng-chart/primeng-chart.component')).PrimengChartComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-data',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengData'
    },
    loadComponent: async () => (await import('./components/primeng-data/primeng-data.component')).PrimengDataComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-file',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengFile'
    },
    loadComponent: async () => (await import('./components/primeng-file/primeng-file.component')).PrimengFileComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-form',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengForm'
    },
    loadComponent: async () => (await import('./components/primeng-form/primeng-form.component')).PrimengFormComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-menu',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengMenu'
    },
    loadComponent: async () => (await import('./components/primeng-menu/primeng-menu.component')).PrimengMenuComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-messages',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengMessages'
    },
    loadComponent: async () =>
      (await import('./components/primeng-messages/primeng-messages.component')).PrimengMessagesComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-misc',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengMisc'
    },
    loadComponent: async () => (await import('./components/primeng-misc/primeng-misc.component')).PrimengMiscComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-overlay',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengOverlay'
    },
    loadComponent: async () =>
      (await import('./components/primeng-overlay/primeng-overlay.component')).PrimengOverlayComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-panel',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengPanel'
    },
    loadComponent: async () =>
      (await import('./components/primeng-panel/primeng-panel.component')).PrimengPanelComponent,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  }
];
