import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardInformationsbereichComponent} from './components/dashboard-informationsbereich/dashboard-informationsbereich.component';
import {DashboardLinksnavigationComponent} from './components/dashboard-linksnavigation/dashboard-linksnavigation.component';
import {DashboardComponent} from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: '',
    outlet: 'linksnavigation',
    component: DashboardLinksnavigationComponent
  },
  {
    path: '',
    outlet: 'informationsbereich',
    component: DashboardInformationsbereichComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
