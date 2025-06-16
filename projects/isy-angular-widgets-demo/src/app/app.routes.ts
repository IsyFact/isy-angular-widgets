import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/errors/page-not-found/page-not-found.component';
import {canActivateAuth} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: async () => (await import('./feature/dashboard/dashboard.routes')).dashboardRoutes
  },
  {
    path: 'objekt-anzeigen',
    loadChildren: async () => (await import('./feature/objekt-anzeigen/objekt-anzeigen.routes')).objektAnzeigenRoutes,
    canActivate: [canActivateAuth]
  },
  {
    path: 'primeng-widgets',
    loadChildren: async () => (await import('./feature/primeng-widgets/primeng-widgets.routes')).primengWidgetsRoutes,
    canActivate: [canActivateAuth]
  },
  {
    path: 'objekt-suchen',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.searchObject'
    },
    loadComponent: async () => (await import('./feature/objekt-suchen/objekt-suchen.component')).ObjektSuchenComponent,
    canActivate: [canActivateAuth]
  },
  {
    path: 'isy-angular-components',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.isyAngularComponents'
    },
    loadComponent: async () =>
      (await import('./feature/isy-angular-components/isy-angular-components.component')).IsyAngularComponentsComponent,
    canActivate: [canActivateAuth]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
