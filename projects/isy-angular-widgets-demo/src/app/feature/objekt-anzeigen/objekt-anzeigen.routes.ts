import {Routes} from '@angular/router';

export const objektAnzeigenRoutes: Routes = [
  {
    path: '',
    data: {
      title: 'isyAngularWidgetsDemo.websiteTitles.displayObject'
    },
    loadComponent: async () => (await import('./objekt-anzeigen.component')).ObjektAnzeigenComponent
  },
  {
    path: ':id',
    data: {},
    loadComponent: async () => (await import('./objekt-anzeigen.component')).ObjektAnzeigenComponent
  }
];
