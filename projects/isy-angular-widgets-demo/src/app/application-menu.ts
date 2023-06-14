export const applicationMenu = [
  {
    label: $localize`Bedienkonzept Vorgaben`,
    items: [
      [
        {
          label: $localize`Häufige Aufgaben`,
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
      ]
    ]
  },
  {
    label: $localize`Beispiel Menüpunkt`,
    items: [
      [
        {
          label: $localize`Beispiel Gruppe 1`,
          items: [
            {
              label: $localize`Beispiel Unterpunkt 1`
            },
            {
              label: $localize`Beispiel Unterpunkt 2`
            },
            {
              label: $localize`Beispiel Unterpunkt 3`
            }
          ]
        },
        {
          label: $localize`Beispiel Gruppe 2`,
          items: [
            {
              label: $localize`Beispiel Unterpunkt 1`
            },
            {
              label: $localize`Beispiel Unterpunkt 2`
            },
            {
              label: $localize`Beispiel Unterpunkt 3`
            }
          ]
        }
      ]
    ]
  },
  {
    label: $localize`Beispiel Menüpunkt (Disabled)`,
    disabled: true
  }
];
