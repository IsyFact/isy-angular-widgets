export const navigationMenu = [
  {
    label: 'Quicklinks',
    expanded: true,
    items: [
      {
        label: 'Beispiel Quicklink 1'
      },
      {
        label: 'Beispiel Quicklink 2',
        visible: true
      }
    ]
  },
  {
    label: 'Häufige Aufgaben',
    expanded: true,
    items: [
      {
        label: 'Objekt suchen',
        routerLink: 'bedienkonzept/objekt-suchen'
      },
      {
        label: 'Objekt anzeigen',
        routerLink: 'bedienkonzept/objekt-anzeigen/42'
      },
      {
        label: 'Char Picker',
        routerLink: 'bedienkonzept/char-picker/43'
      }
    ]
  }
];
