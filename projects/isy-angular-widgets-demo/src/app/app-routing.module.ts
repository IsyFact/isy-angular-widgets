import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardViewComponent} from './feature/dashboard/dashboard-view.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardViewComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'dashboard',
    loadChildren: async() => (await import('./feature/dashboard/dashboard-view.module')).DashboardViewModule
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
