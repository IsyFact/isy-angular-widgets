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
              routerLink: 'bedienkonzept/objekt-suchen'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.displayObject',
              routerLink: 'bedienkonzept/objekt-anzeigen/42'
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
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem1'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem2'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem3'
            }
          ]
        },
        {
          label: 'isyAngularWidgetsDemo.menuItems.exampleGroup2',
          items: [
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem1'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem2'
            },
            {
              label: 'isyAngularWidgetsDemo.menuItems.exampleSubMenuItem3'
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
