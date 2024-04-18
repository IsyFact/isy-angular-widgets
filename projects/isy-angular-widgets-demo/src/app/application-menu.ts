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
              routerLink: 'objekt-suchen',
              data: {
                title: 'isyAngularWidgetsDemo.websiteTitles.searchObject'
              },
              styleClass: 'skip-link'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.displayObject',
              routerLink: 'objekt-anzeigen/42',
              data: {
                title: 'isyAngularWidgetsDemo.websiteTitles.displayObject'
              },
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
