import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {AuthGuard} from '@isy-angular-widgets/security/security-guard';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {PageNotFoundComponent} from './shared/errors/page-not-found/page-not-found.component';
import {PrimengFormComponent} from './feature/primeng-widgets/components/primeng-form/primeng-form.component';
import {PrimengButtonComponent} from './feature/primeng-widgets/components/primeng-button/primeng-button.component';
import {PrimengDataComponent} from './feature/primeng-widgets/components/primeng-data/primeng-data.component';
import {PrimengPanelComponent} from './feature/primeng-widgets/components/primeng-panel/primeng-panel.component';
import {PrimengOverlayComponent} from './feature/primeng-widgets/components/primeng-overlay/primeng-overlay.component';
import {PrimengFileComponent} from './feature/primeng-widgets/components/primeng-file/primeng-file.component';
import {PrimengMenuComponent} from './feature/primeng-widgets/components/primeng-menu/primeng-menu.component';
import {PrimengChartComponent} from './feature/primeng-widgets/components/primeng-chart/primeng-chart.component';
import {PrimengMessagesComponent} from './feature/primeng-widgets/components/primeng-messages/primeng-messages.component';
import {PrimengMiscComponent} from './feature/primeng-widgets/components/primeng-misc/primeng-misc.component';

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
    path: 'isy-angular-components',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.isyAngularComponents'
    },
    loadComponent: async () =>
      (await import('./feature/isy-angular-components/isy-angular-components.component')).IsyAngularComponentsComponent
    /* canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)] */
  },
  {
    path: 'primeng-widgets/primeng-form',
    component: PrimengFormComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengForm'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-button',
    component: PrimengButtonComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengButton'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-data',
    component: PrimengDataComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengData'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-panel',
    component: PrimengPanelComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengPanel'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-overlay',
    component: PrimengOverlayComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengOverlay'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-file',
    component: PrimengFileComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengFile'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-menu',
    component: PrimengMenuComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengMenu'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-chart',
    component: PrimengChartComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengChart'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-messages',
    component: PrimengMessagesComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengMessages'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
    canActivate: [(route: ActivatedRouteSnapshot): Observable<boolean> => canActivate(route)]
  },
  {
    path: 'primeng-widgets/primeng-misc',
    component: PrimengMiscComponent,
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.primengMisc'
    },
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.module')).PrimengWidgetsModule,
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
