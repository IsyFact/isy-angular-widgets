import {dashboardRoutes} from './dashboard.routes';
import {DashboardComponent} from './dashboard.component';
import {DashboardLinksnavigationComponent} from './components/dashboard-linksnavigation/dashboard-linksnavigation.component';
import {DashboardInformationsbereichComponent} from './components/dashboard-informationsbereich/dashboard-informationsbereich.component';

describe('dashboardRoutes', () => {
  it('should define 3 routes', () => {
    expect(dashboardRoutes.length).toBe(3);
  });

  it('should have default path route with DashboardComponent and title', () => {
    const route = dashboardRoutes.find((r) => r.path === '' && !r.outlet);
    expect(route).toBeDefined();
    expect(route!.component).toBe(DashboardComponent);
    expect(route!.data?.title).toBe('Dashboard');
  });

  it('should define named outlet "linksnavigation" with DashboardLinksnavigationComponent', () => {
    const route = dashboardRoutes.find((r) => r.outlet === 'linksnavigation');
    expect(route).toBeDefined();
    expect(route!.component).toBe(DashboardLinksnavigationComponent);
  });

  it('should define named outlet "informationsbereich" with DashboardInformationsbereichComponent', () => {
    const route = dashboardRoutes.find((r) => r.outlet === 'informationsbereich');
    expect(route).toBeDefined();
    expect(route!.component).toBe(DashboardInformationsbereichComponent);
  });
});
