import {Routes} from '@angular/router';
import {DashboardInformationsbereichComponent} from './components/dashboard-informationsbereich/dashboard-informationsbereich.component';
import {DashboardLinksnavigationComponent} from './components/dashboard-linksnavigation/dashboard-linksnavigation.component';
import {DashboardComponent} from './dashboard.component';

export const dashboardRoutes: Routes = [
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
