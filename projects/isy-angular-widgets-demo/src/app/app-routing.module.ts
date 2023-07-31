import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './feature/dashboard/components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'dashboard',
    loadChildren: async() => (await import('./feature/dashboard/dashboard.module')).DashboardModule
  },
  {
    path: 'objekt-anzeigen',
    loadChildren: async() => (await import('./feature/objekt-anzeigen/objekt-anzeigen.module')).ObjektAnzeigenModule
  },
  {
    path: 'objekt-suchen',
    loadChildren: async() => (await import('./feature/objekt-suchen/objekt-suchen.module')).ObjektSuchenModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
