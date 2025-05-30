import {primengWidgetsRoutes} from './primeng-widgets.routes';

describe('primengWidgetsRoutes', () => {
  it('should define 10 routes', () => {
    expect(primengWidgetsRoutes.length).toBe(10);
  });

  it('should define correct paths and titles', () => {
    const expectedRoutes = [
      {path: 'primeng-button', title: 'isyAngularWidgetsDemo.websiteTitles.primengButton'},
      {path: 'primeng-chart', title: 'isyAngularWidgetsDemo.websiteTitles.primengChart'},
      {path: 'primeng-data', title: 'isyAngularWidgetsDemo.websiteTitles.primengData'},
      {path: 'primeng-file', title: 'isyAngularWidgetsDemo.websiteTitles.primengFile'},
      {path: 'primeng-form', title: 'isyAngularWidgetsDemo.websiteTitles.primengForm'},
      {path: 'primeng-menu', title: 'isyAngularWidgetsDemo.websiteTitles.primengMenu'},
      {path: 'primeng-messages', title: 'isyAngularWidgetsDemo.websiteTitles.primengMessages'},
      {path: 'primeng-misc', title: 'isyAngularWidgetsDemo.websiteTitles.primengMisc'},
      {path: 'primeng-overlay', title: 'isyAngularWidgetsDemo.websiteTitles.primengOverlay'},
      {path: 'primeng-panel', title: 'isyAngularWidgetsDemo.websiteTitles.primengPanel'}
    ];

    expectedRoutes.forEach(({path, title}, index) => {
      expect(primengWidgetsRoutes[index].path).toBe(path);
      expect(primengWidgetsRoutes[index].data?.title).toBe(title);
    });
  });

  it('should define loadComponent as a function for each route', () => {
    primengWidgetsRoutes.forEach((route) => {
      expect(typeof route.loadComponent).toBe('function');
    });
  });
});
