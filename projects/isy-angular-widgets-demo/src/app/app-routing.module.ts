import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './feature/bedienkonzept/pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'bedienkonzept',
    loadChildren: async() => (await import('./feature/bedienkonzept/bedienkonzept.module')).BedienkonzeptModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
