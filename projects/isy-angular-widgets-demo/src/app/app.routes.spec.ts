import {routes} from './app.routes';
import {PageNotFoundComponent} from './shared/errors/page-not-found/page-not-found.component';
import {canActivateAuth} from './guards/auth.guard';

describe('App Routing Configuration', () => {
  it('should define 7 routes', () => {
    expect(routes.length).toBe(7);
  });

  it('should have a redirect from empty path to dashboard', () => {
    const route = routes.find((r) => r.path === '');
    expect(route).toBeDefined();
    expect(route!.redirectTo).toBe('dashboard');
    expect(route!.pathMatch).toBe('full');
  });

  it('should lazy load dashboardRoutes', async () => {
    const route = routes.find((r) => r.path === 'dashboard');
    expect(route).toBeDefined();
    expect(typeof route!.loadChildren).toBe('function');

    const module = await route!.loadChildren!();
    expect(module).toBeDefined();
    expect(Array.isArray(module)).toBeTrue(); // Annahme: dashboardRoutes ist ein Routes[]
  });

  it('should lazy load objektAnzeigenRoutes and be protected by canActivateAuth', async () => {
    const route = routes.find((r) => r.path === 'objekt-anzeigen');
    expect(route).toBeDefined();
    expect(route!.canActivate).toContain(canActivateAuth);
    expect(typeof route!.loadChildren).toBe('function');

    const module = await route!.loadChildren!();
    expect(module).toBeDefined();
    expect(Array.isArray(module)).toBeTrue();
  });

  it('should lazy load primengWidgetsRoutes and be protected by canActivateAuth', async () => {
    const route = routes.find((r) => r.path === 'primeng-widgets');
    expect(route).toBeDefined();
    expect(route!.canActivate).toContain(canActivateAuth);
    expect(typeof route!.loadChildren).toBe('function');

    const module = await route!.loadChildren!();
    expect(module).toBeDefined();
    expect(Array.isArray(module)).toBeTrue();
  });

  it('should load ObjektSuchenComponent with title and auth guard', async () => {
    const route = routes.find((r) => r.path === 'objekt-suchen');
    expect(route).toBeDefined();
    expect(route!.data?.title).toBe('isyAngularWidgetsDemo.websiteTitles.searchObject');
    expect(route!.canActivate).toContain(canActivateAuth);
    expect(typeof route!.loadComponent).toBe('function');

    const component = await route!.loadComponent!();
    expect(component).toBeDefined();
  });

  it('should load IsyAngularComponentsComponent with title and auth guard', async () => {
    const route = routes.find((r) => r.path === 'isy-angular-components');
    expect(route).toBeDefined();
    expect(route!.data?.title).toBe('isyAngularWidgetsDemo.websiteTitles.isyAngularComponents');
    expect(route!.canActivate).toContain(canActivateAuth);
    expect(typeof route!.loadComponent).toBe('function');

    const component = await route!.loadComponent!();
    expect(component).toBeDefined();
  });

  it('should route wildcard path to PageNotFoundComponent', () => {
    const route = routes.find((r) => r.path === '**');
    expect(route).toBeDefined();
    expect(route!.component).toBe(PageNotFoundComponent);
  });
});
