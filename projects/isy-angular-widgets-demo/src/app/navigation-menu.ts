export const navigationMenu = [
  {
    label: 'isyAngularWidgetsDemo.menuItems.quickLinks',
    expanded: true,
    items: [
      {
        label: 'isyAngularWidgetsDemo.menuItems.exampleQuickLink1',
        styleClass: 'skip-link'
      },
      {
        label: 'isyAngularWidgetsDemo.menuItems.exampleQuickLink2',
        visible: true,
        styleClass: 'skip-link'
      }
    ]
  },
  {
    label: 'isyAngularWidgetsDemo.menuItems.frequentTasks',
    expanded: true,
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
];
