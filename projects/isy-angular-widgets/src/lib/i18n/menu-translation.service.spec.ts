import { TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MenuTranslationService } from './menu-translation.service';
import {MegaMenuItem, MenuItem} from "primeng/api";

describe('MenuTranslationService', () => {
  let service: MenuTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule.withTranslations('de', {
          'menu.label': 'Menu label',
          'submenu.label': 'Submenu label',
          'menu.header': 'Submenu header',
        })
      ]
    });
    service = TestBed.inject(MenuTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('translates MenuItems labels', async () => {
    const items : MenuItem[] = [
      { label: 'menu.label'}
    ]

    const translatedItems = await service.translateMenuItems(items)

    expect(translatedItems[0].label).toEqual('Menu label')
  })

  it('translates submenu items labels', async() => {
    const items : MenuItem[] = [
      {
        label: 'menu.label',
        items: [
          {label: 'submenu.label'}
        ]
      }
    ]

    const translatedItems = await service.translateMenuItems(items)
    // @ts-ignore
    const translatedSubMenuItem = translatedItems[0]?.items[0]

    expect(translatedSubMenuItem.label).toEqual('Submenu label')
  })

  it('translates MegaMenuItems labels', async() => {
    const items : MegaMenuItem[] = [
      { label: 'menu.label'}
    ]

    const translatedItems = await service.translateMegaMenuItems(items)

    expect(translatedItems[0].label).toEqual('Menu label')
  })

  it('translates MegaMenu submenu items labels', async() => {
    const items : MegaMenuItem[] = [
      {
        label: 'menu.label',
        items: [
          [
            {
              label: 'menu.header',
              items: [{ label: 'submenu.label' }]
            }
          ]
        ]
      }]

    const translatedItems = await service.translateMegaMenuItems(items)
    // @ts-ignore
    const translatedSubMenuItem = translatedItems[0]?.items[0][0]

    expect(translatedSubMenuItem.label).toEqual('Submenu header')
    // @ts-ignore
    expect(translatedSubMenuItem.items[0].label).toEqual('Submenu label')
  })
});
