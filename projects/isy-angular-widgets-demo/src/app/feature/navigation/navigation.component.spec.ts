import {createComponentFactory, Spectator} from '@ngneat/spectator/vitest';
import {NavigationComponent} from './navigation.component';

describe('NavigationComponent', () => {
  let spectator: Spectator<NavigationComponent>;
  const createComponent = createComponentFactory({component: NavigationComponent});

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create three main items for the simple application example', () => {
    expect(spectator.component.applicationMainItems).toHaveLength(3);
    expect(spectator.component.applicationMainItems.map((item) => item.label)).toEqual([
      'Menüpunkt 1',
      'Menüpunkt 2',
      'Menüpunkt 3'
    ]);
  });

  it('should expose three numbered subitems for every main item', () => {
    spectator.component.applicationMainItems.forEach((mainItem) => {
      const componentGroup = mainItem.items?.[0]?.[0];
      expect(componentGroup?.label).toBe('Komponenten');
      expect(componentGroup?.items?.map((item) => item.label)).toHaveLength(3);
    });
  });

  it('should update functions when a subitem is selected', () => {
    spectator.component.selectApplicationSub(1, 2);

    expect(spectator.component.applicationLinkNavigationItems.map((item) => item.label)).toEqual([
      'Funktion 2.3.1',
      'Funktion 2.3.2',
      'Funktion 2.3.3'
    ]);
  });

  it('should mark the selected function active', () => {
    spectator.component.selectApplicationSub(0, 1);
    spectator.component.selectFunction(1);

    expect(spectator.component.applicationLinkNavigationItems[1].styleClass).toBe('p-panelmenu-item-active');
    expect(spectator.component.applicationLinkNavigationItems[0].styleClass).toBeUndefined();
  });

  it('should update grouped applications and use cases', () => {
    spectator.component.selectGroupApplication(1, 2);

    expect(spectator.component.mainItems[1].items?.[0]?.[0]?.items?.[2]?.label).toBe('Anwendung 2.3');
    expect(spectator.component.linkNavigationItems[0].items?.[0]?.label).toBe('Use Case 2.3.1.1');
  });

  it('should mark the selected use case active', () => {
    spectator.component.selectGroupApplication(0, 1);
    spectator.component.selectUseCase('1.2.2.3');

    const selectedGroup = spectator.component.linkNavigationItems[1];
    const selectedUseCase = selectedGroup.items?.[2];

    expect(selectedUseCase?.styleClass).toBe('p-panelmenu-item-active');
    expect(selectedUseCase?.linkStyle).toEqual({backgroundColor: '#0055b9', color: '#ffffff'});
  });
});
