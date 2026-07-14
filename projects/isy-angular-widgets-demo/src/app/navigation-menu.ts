import {MenuItem} from 'primeng/api';

const MENU_ITEMS_PREFIX = 'isyAngularWidgetsDemo.menuItems';
const SKIP_LINK_PREFIX = 'isyAngularWidgetsDemo.actions.skipNavigationLink';

const createNavigationItem = (key: string, routerLink: string): MenuItem => ({
  label: `${MENU_ITEMS_PREFIX}.${key}`,
  title: `${SKIP_LINK_PREFIX}.${key}`,
  routerLink,
  styleClass: 'skip-link'
});

const createCustomNavigationItem = (label: string, title: string, routerLink: string): MenuItem => ({
  label,
  title,
  routerLink,
  styleClass: 'skip-link'
});

export const navigationMenu: MenuItem[] = [
  {
    label: `${MENU_ITEMS_PREFIX}.frequentTasks`,
    expanded: true,
    items: [
      createNavigationItem('searchObject', '/objekt-suchen'),
      createNavigationItem('displayObject', '/objekt-anzeigen/42')
    ]
  },
  {
    label: `${MENU_ITEMS_PREFIX}.uiWidgets`,
    expanded: true,
    items: [
      createNavigationItem('isyAngularComponents', '/isy-angular-components'),
      createCustomNavigationItem('Modalarme Patterns', 'zur Modalarme Patterns Seite wechseln', '/modalarme-patterns'),
      createNavigationItem('primengForm', '/primeng-widgets/primeng-form'),
      createNavigationItem('primengButton', '/primeng-widgets/primeng-button'),
      createNavigationItem('primengData', '/primeng-widgets/primeng-data'),
      createNavigationItem('primengPanel', '/primeng-widgets/primeng-panel'),
      createNavigationItem('primengOverlay', '/primeng-widgets/primeng-overlay'),
      createNavigationItem('primengFile', '/primeng-widgets/primeng-file'),
      createNavigationItem('primengMenu', '/primeng-widgets/primeng-menu'),
      createNavigationItem('primengChart', '/primeng-widgets/primeng-chart'),
      createNavigationItem('primengMessages', '/primeng-widgets/primeng-messages'),
      createNavigationItem('primengMisc', '/primeng-widgets/primeng-misc')
    ]
  }
];
