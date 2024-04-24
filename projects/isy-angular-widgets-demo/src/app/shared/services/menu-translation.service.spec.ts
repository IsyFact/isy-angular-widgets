import {TranslateTestingModule} from 'ngx-translate-testing';
import {MenuTranslationService} from './menu-translation.service';
import {MegaMenuItem, MenuItem} from 'primeng/api';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

describe('Unit Tests: MenuTranslationService', () => {
  let spectator: SpectatorService<MenuTranslationService>;
  const createdService = createServiceFactory({
    service: MenuTranslationService,
    imports: [
      TranslateTestingModule.withTranslations('de', {
        'menu.label': 'Menu label',
        'submenu.label': 'Submenu label',
        'menu.title': 'Menu title',
        'submenu.title': 'Submenu title',
        'menu.header': 'Submenu header'
      })
    ]
  });

  beforeEach(() => (spectator = createdService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should translate MenuItems labels and titles', async () => {
    const items: MenuItem[] = [{
      label: 'menu.label',
      title: 'menu.title'
    }];

    const translatedItems = await spectator.service.translateMenuItems(items);

    expect(translatedItems[0].label).toEqual('Menu label');
    expect(translatedItems[0].title).toEqual('Menu title');
  });

  it('should translate submenu items labels and titles', async () => {
    const items: MenuItem[] = [
      {
        label: 'menu.label',
        title: 'menu.title',
        items: [{
          label: 'submenu.label',
          title: 'submenu.title'
        }]
      }
    ];

    const translatedItems = await spectator.service.translateMenuItems(items);
    const translatedSubMenuItem = translatedItems[0]?.items?.[0];

    expect(translatedSubMenuItem?.label).toEqual('Submenu label');
    expect(translatedSubMenuItem?.title).toEqual('Submenu title');
  });

  it('should translate MegaMenuItems labels and titles', async () => {
    const items: MegaMenuItem[] = [{
      label: 'menu.label',
      title: 'menu.title'
    }];

    const translatedItems = await spectator.service.translateMegaMenuItems(items);

    expect(translatedItems[0].label).toEqual('Menu label');
    expect(translatedItems[0].title).toEqual('Menu title');
  });

  it('should translate MegaMenu submenu items labels', async () => {
    const items: MegaMenuItem[] = [
      {
        label: 'menu.label',
        title: 'menu.title',
        items: [
          [{
            label: 'menu.header',
            items: [{
              label: 'submenu.label',
              title: 'submenu.title'
            }]
          }]
        ]
      }
    ];

    const translatedItems = await spectator.service.translateMegaMenuItems(items);
    const translatedSubMenuItem = translatedItems[0]?.items?.[0][0];

    expect(translatedSubMenuItem?.label).toEqual('Submenu header');
    expect(translatedSubMenuItem?.items?.[0].label).toEqual('Submenu label');
    expect(translatedSubMenuItem?.items?.[0].title).toEqual('Submenu title');
  });
});
