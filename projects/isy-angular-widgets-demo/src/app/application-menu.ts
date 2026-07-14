import {MenuItem} from 'primeng/api';

const MENU_ITEMS_PREFIX = 'isyAngularWidgetsDemo.menuItems';
const SKIP_LINK_PREFIX = 'isyAngularWidgetsDemo.actions.skipNavigationLink';

const createNavigationItem = (key: string, routerLink: string): MenuItem => ({
  label: `${MENU_ITEMS_PREFIX}.${key}`,
  title: `${SKIP_LINK_PREFIX}.${key}`,
  routerLink,
  styleClass: 'skip-link'
});

const createExampleItem = (key: string): MenuItem => ({
  label: `${MENU_ITEMS_PREFIX}.${key}`,
  styleClass: 'skip-link'
});

const createExampleItems = (): MenuItem[] => [
  createExampleItem('exampleSubMenuItem1'),
  createExampleItem('exampleSubMenuItem2'),
  createExampleItem('exampleSubMenuItem3')
];

export const applicationMenu = [
  {
    label: `${MENU_ITEMS_PREFIX}.bedienkonzeptSpecifications`,
    items: [
      [
        {
          label: `${MENU_ITEMS_PREFIX}.frequentTasks`,
          items: [
            createNavigationItem('searchObject', '/objekt-suchen'),
            createNavigationItem('displayObject', '/objekt-anzeigen/42')
          ]
        },
        {
          label: `${MENU_ITEMS_PREFIX}.uiWidgets`,
          items: [
            createNavigationItem('isyAngularComponents', '/isy-angular-components'),
            {
              label: 'Modalarme Patterns',
              title: 'zur Modalarme Patterns Seite wechseln',
              routerLink: '/modalarme-patterns',
              styleClass: 'skip-link'
            },
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
      ]
    ]
  },
  {
    label: `${MENU_ITEMS_PREFIX}.exampleMenuItem`,
    items: [
      [
        {
          label: `${MENU_ITEMS_PREFIX}.exampleGroup1`,
          items: createExampleItems()
        },
        {
          label: `${MENU_ITEMS_PREFIX}.exampleGroup2`,
          items: createExampleItems()
        }
      ]
    ]
  },
  {
    label: `${MENU_ITEMS_PREFIX}.exampleMenuItemDisabled`,
    disabled: true
  }
];
