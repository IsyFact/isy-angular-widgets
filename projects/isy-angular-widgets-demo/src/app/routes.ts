import {Routes} from '@angular/router';
import {AuthGuard} from '../../../isy-angular-widgets/src/lib/security/security-guard';

export const routes : Routes = [
  {
    path: 'dashboard',
    data: {
      title: 'Dashboard'
    },
    loadChildren: async() => (await import('./feature/dashboard/dashboard.module')).DashboardModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'objekt-anzeigen',
    loadChildren: async() => (await import('./feature/objekt-anzeigen/objekt-anzeigen.module')).ObjektAnzeigenModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'objekt-suchen',
    loadChildren: async() => (await import('./feature/objekt-suchen/objekt-suchen.module')).ObjektSuchenModule,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
