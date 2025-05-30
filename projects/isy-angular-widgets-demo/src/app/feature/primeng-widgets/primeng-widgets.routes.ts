import {Routes} from '@angular/router';
import {Type} from '@angular/core';

interface WidgetRouteConfig {
  name: string;
  title: string;
  component: string;
}

const widgetRoutes: WidgetRouteConfig[] = [
  {name: 'primeng-button', title: 'primengButton', component: 'PrimengButtonComponent'},
  {name: 'primeng-chart', title: 'primengChart', component: 'PrimengChartComponent'},
  {name: 'primeng-data', title: 'primengData', component: 'PrimengDataComponent'},
  {name: 'primeng-file', title: 'primengFile', component: 'PrimengFileComponent'},
  {name: 'primeng-form', title: 'primengForm', component: 'PrimengFormComponent'},
  {name: 'primeng-menu', title: 'primengMenu', component: 'PrimengMenuComponent'},
  {name: 'primeng-messages', title: 'primengMessages', component: 'PrimengMessagesComponent'},
  {name: 'primeng-misc', title: 'primengMisc', component: 'PrimengMiscComponent'},
  {name: 'primeng-overlay', title: 'primengOverlay', component: 'PrimengOverlayComponent'},
  {name: 'primeng-panel', title: 'primengPanel', component: 'PrimengPanelComponent'}
];

export const primengWidgetsRoutes: Routes = widgetRoutes.map(({name, title, component}) => ({
  path: name,
  data: {
    title: `isyAngularWidgetsDemo.websiteTitles.${title}`
  },
  loadComponent: async (): Promise<Type<unknown>> => {
    const module = (await import(`./components/${name}/${name}.component`)) as Record<string, Type<unknown>>;
    return module[component];
  }
}));
