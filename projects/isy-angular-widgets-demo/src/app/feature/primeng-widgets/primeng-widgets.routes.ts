import {Routes} from '@angular/router';
import {Type} from '@angular/core';

interface WidgetRouteConfig {
  name: string;
  title: string;
  loadComponent: () => Promise<Type<unknown>>;
}

const widgetRoutes: WidgetRouteConfig[] = [
  {
    name: 'primeng-button',
    title: 'primengButton',
    loadComponent: async () =>
      (await import('./components/primeng-button/primeng-button.component')).PrimengButtonComponent
  },
  {
    name: 'primeng-chart',
    title: 'primengChart',
    loadComponent: async () =>
      (await import('./components/primeng-chart/primeng-chart.component')).PrimengChartComponent
  },
  {
    name: 'primeng-data',
    title: 'primengData',
    loadComponent: async () => (await import('./components/primeng-data/primeng-data.component')).PrimengDataComponent
  },
  {
    name: 'primeng-file',
    title: 'primengFile',
    loadComponent: async () => (await import('./components/primeng-file/primeng-file.component')).PrimengFileComponent
  },
  {
    name: 'primeng-form',
    title: 'primengForm',
    loadComponent: async () => (await import('./components/primeng-form/primeng-form.component')).PrimengFormComponent
  },
  {
    name: 'primeng-menu',
    title: 'primengMenu',
    loadComponent: async () => (await import('./components/primeng-menu/primeng-menu.component')).PrimengMenuComponent
  },
  {
    name: 'primeng-messages',
    title: 'primengMessages',
    loadComponent: async () =>
      (await import('./components/primeng-messages/primeng-messages.component')).PrimengMessagesComponent
  },
  {
    name: 'primeng-misc',
    title: 'primengMisc',
    loadComponent: async () => (await import('./components/primeng-misc/primeng-misc.component')).PrimengMiscComponent
  },
  {
    name: 'primeng-overlay',
    title: 'primengOverlay',
    loadComponent: async () =>
      (await import('./components/primeng-overlay/primeng-overlay.component')).PrimengOverlayComponent
  },
  {
    name: 'primeng-panel',
    title: 'primengPanel',
    loadComponent: async () =>
      (await import('./components/primeng-panel/primeng-panel.component')).PrimengPanelComponent
  }
];

export const primengWidgetsRoutes: Routes = widgetRoutes.map(({name, title, loadComponent}) => ({
  path: name,
  data: {
    title: `isyAngularWidgetsDemo.websiteTitles.${title}`
  },
  loadComponent
}));
