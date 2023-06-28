export const applicationMenu = [
  {
    label: 'Bedienkonzept Vorgaben',
    items: [
      [
        {
          label: 'Häufige Aufgaben',
          items: [
            {
              label: 'Objekt suchen',
              routerLink: 'bedienkonzept/objekt-suchen'
            },
            {
              label: 'Objekt anzeigen',
              routerLink: 'bedienkonzept/objekt-anzeigen/42'
            }
          ]
        }
      ]
    ]
  },
  {
    label: 'Beispiel Menüpunkt',
    items: [
      [
        {
          label: 'Beispiel Gruppe 1',
          items: [
            {
              label: 'Beispiel Unterpunkt 1'
            },
            {
              label: 'Beispiel Unterpunkt 2'
            },
            {
              label: 'Beispiel Unterpunkt 3'
            }
          ]
        },
        {
          label: 'Beispiel Gruppe 2',
          items: [
            {
              label: 'Beispiel Unterpunkt 1'
            },
            {
              label: 'Beispiel Unterpunkt 2'
            },
            {
              label: 'Beispiel Unterpunkt 3'
            }
          ]
        }
      ]
    ]
  },
  {
    label: 'Beispiel Menüpunkt (Disabled)',
    disabled: true
  }
];
