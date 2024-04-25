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
        title: 'isyAngularWidgetsDemo.actions.skipNavigationLink.searchObject',
        routerLink: 'objekt-suchen',
        styleClass: 'skip-link'
      },
      {
        label: 'isyAngularWidgetsDemo.menuItems.displayObject',
        title: 'isyAngularWidgetsDemo.actions.skipNavigationLink.displayObject',
        routerLink: 'objekt-anzeigen/42',
        styleClass: 'skip-link'
      }
    ]
  }
];
