import {objektAnzeigenRoutes} from './objekt-anzeigen.routes';

describe('objektAnzeigenRoutes', () => {
  it('should define two routes', () => {
    expect(objektAnzeigenRoutes.length).toBe(2);
  });

  it('should have empty path for first route and correct title', () => {
    const route = objektAnzeigenRoutes[0];
    expect(route.path).toBe('');
    expect(route.data?.title).toBe('isyAngularWidgetsDemo.websiteTitles.displayObject');
  });

  it('should have parameterized path for second route', () => {
    const route = objektAnzeigenRoutes[1];
    expect(route.path).toBe(':id');
  });

  it('should load component asynchronously for "" path', async () => {
    const route = objektAnzeigenRoutes[0];
    const component = await route.loadComponent?.();
    expect(component).toBeDefined();
  });

  it('should load component asynchronously for ":id" path', async () => {
    const route = objektAnzeigenRoutes[1];
    const component = await route.loadComponent?.();
    expect(component).toBeDefined();
  });
});
