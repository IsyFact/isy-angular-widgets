import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {MenuTranslationService} from './menu-translation.service';
import {MegaMenuItem, MenuItem} from 'primeng/api';

import {provideTranslateService, TranslateLoader, TranslateNoOpLoader, TranslateService} from '@ngx-translate/core';

describe('Unit Tests: MenuTranslationService', () => {
  let spectator: SpectatorService<MenuTranslationService>;
  const createdService = createServiceFactory({
    service: MenuTranslationService,
    providers: [provideTranslateService(), {provide: TranslateLoader, useClass: TranslateNoOpLoader}]
  });

  beforeEach(() => {
    spectator = createdService();

    const translate = spectator.inject(TranslateService);
    translate.setTranslation(
      'de',
      {
        'menu.label': 'Menu label',
        'submenu.label': 'Submenu label',
        'menu.title': 'Menu title',
        'submenu.title': 'Submenu title',
        'menu.header': 'Submenu header'
      },
      true
    );
    translate.use('de');
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should translate MenuItems labels and titles', async () => {
    const items: MenuItem[] = [{label: 'menu.label', title: 'menu.title'}];
    const translated = await spectator.service.translateMenuItems(items);
    expect(translated[0].label).toBe('Menu label');
    expect(translated[0].title).toBe('Menu title');
  });

  it('should translate submenu items labels and titles', async () => {
    const items: MenuItem[] = [
      {
        label: 'menu.label',
        title: 'menu.title',
        items: [{label: 'submenu.label', title: 'submenu.title'}]
      }
    ];
    const translated = await spectator.service.translateMenuItems(items);
    const sub = translated[0]?.items?.[0];
    expect(sub?.label).toBe('Submenu label');
    expect(sub?.title).toBe('Submenu title');
  });

  it('should translate MegaMenuItems labels and titles', async () => {
    const items: MegaMenuItem[] = [{label: 'menu.label', title: 'menu.title'}];
    const translated = await spectator.service.translateMegaMenuItems(items);
    expect(translated[0].label).toBe('Menu label');
    expect(translated[0].title).toBe('Menu title');
  });

  it('should translate MegaMenu submenu items labels', async () => {
    const items: MegaMenuItem[] = [
      {
        label: 'menu.label',
        title: 'menu.title',
        items: [[{label: 'menu.header', items: [{label: 'submenu.label', title: 'submenu.title'}]}]]
      }
    ];
    const translated = await spectator.service.translateMegaMenuItems(items);
    const sub = translated[0]?.items?.[0][0];
    expect(sub?.label).toBe('Submenu header');
    expect(sub?.items?.[0].label).toBe('Submenu label');
    expect(sub?.items?.[0].title).toBe('Submenu title');
  });
});
