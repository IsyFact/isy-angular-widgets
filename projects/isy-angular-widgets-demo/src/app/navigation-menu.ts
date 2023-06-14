export const navigationMenu = [
  {
    label: $localize`Quicklinks`,
    expanded: true,
    items: [
      {
        label: $localize`Beispiel Quicklink 1`
      },
      {
        label: $localize`Beispiel Quicklink 2`,
        visible: true
      }
    ]
  },
  {
    label: $localize`Häufige Aufgaben`,
    expanded: true,
    items: [
      {
        label: $localize`Objekt suchen`,
        routerLink: 'bedienkonzept/objekt-suchen'
      },
      {
        label: $localize`Objekt anzeigen`,
        routerLink: 'bedienkonzept/objekt-anzeigen/42'
      }
    ]
  }
];
