export const applicationMenu = [
  {
    label: 'isyAngularWidgetsDemo.menuItems.bedienkonzeptSpecifications',
    items: [
      [
        {
          label: 'isyAngularWidgetsDemo.menuItems.frequentTasks',
          items: [
            {
              label: 'isyAngularWidgetsDemo.menuItems.searchObject',
              title: 'isyAngularWidgetsDemo.actions.skipNavigationLink.searchObject',
              routerLink: 'objekt-suchen',
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.displayObject',
              title: 'isyAngularWidgetsDemo.actions.skipNavigationLink.displayObject',
              routerLink: 'objekt-anzeigen/42',
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.primengWidgets',
              title: 'isyAngularWidgetsDemo.actions.skipNavigationLink.primengWidgets',
              routerLink: 'primeng-widgets',
              styleClass: 'skip-link'
            }
          ]
        }
      ]
    ]
  },
  {
    label: 'isyAngularWidgetsDemo.menuItems.exampleMenuItem',
    items: [
      [
        {
          label: 'isyAngularWidgetsDemo.menuItems.exampleGroup1',
          items: [
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem1',
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem2',
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem3',
              styleClass: 'skip-link'
            }
          ]
        },
        {
          label: 'isyAngularWidgetsDemo.menuItems.exampleGroup2',
          items: [
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem1',
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem2',
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem3',
              styleClass: 'skip-link'
            }
          ]
        }
      ]
    ]
  },
  {
    label: 'isyAngularWidgetsDemo.menuItems.exampleMenuItemDisabled',
    disabled: true
  }
];
