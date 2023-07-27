export const navigationMenu = [
  {
    label: 'isyAngularWidgetsDemo.menuItems.quickLinks',
    expanded: true,
    items: [
      {
        label: 'isyAngularWidgetsDemo.menuItems.exampleQuickLink1'
      },
      {
        label: 'isyAngularWidgetsDemo.menuItems.exampleQuickLink2',
        visible: true
      }
    ]
  },
  {
    label: 'isyAngularWidgetsDemo.menuItems.frequentTasks',
    expanded: true,
    items: [
      {
        label: 'isyAngularWidgetsDemo.menuItems.searchObject',
        routerLink: 'objekt-suchen'
      },
      {
        label: 'isyAngularWidgetsDemo.menuItems.displayObject',
        routerLink: 'objekt-anzeigen/42'
      }
    ]
  }
];
