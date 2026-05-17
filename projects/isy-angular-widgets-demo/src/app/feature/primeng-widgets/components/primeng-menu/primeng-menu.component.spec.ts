import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengMenuComponent} from './primeng-menu.component';
import {electronicData, megaMenuProductData} from '../../data/product';
import {contextMenuData, fileContainerData, menuBarData, optionData, tabMenuData} from '../../data/file-option';
import {personalData} from '../../data/organization';

describe('Unit Tests: PrimengMenuComponent', () => {
  const sectionAnchorIds = [
    'breadcrumb',
    'steps',
    'tabmenu',
    'menubar',
    'megamenu',
    'panelmenu',
    'tieredmenu',
    'contextmenu',
    'menu'
  ];

  let component: PrimengMenuComponent;
  let spectator: Spectator<PrimengMenuComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengMenuComponent,
    providers: [
      {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}},
      {provide: ViewportScroller, useValue: viewportScrollerMock}
    ]
  });

  beforeEach(() => {
    viewportScrollerMock.scrollToAnchor.calls.reset();
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize electronics with electronicData', () => {
    expect(component.electronics).toEqual(electronicData);
  });

  it('should initialize contextMenuOption with contextMenuData', () => {
    expect(component.contextMenuOption).toEqual(contextMenuData);
  });

  it('should initialize option with optionData', () => {
    expect(component.option).toEqual(optionData);
  });

  it('should initialize menuBarOption with menuBarData', () => {
    expect(component.menuBarOption).toEqual(menuBarData);
  });

  it('should initialize megaMenuOptions with megaMenuProductData', () => {
    expect(component.megaMenuOptions).toEqual(megaMenuProductData);
  });

  it('should initialize fileContainerOptions with fileContainerData', () => {
    expect(component.fileContainerOptions).toEqual(fileContainerData);
  });

  it('should initialize stepItem with personalData', () => {
    expect(component.stepItem).toEqual(personalData);
  });

  it('should initialize tabMenuOption with tabMenuData', () => {
    expect(component.tabMenuOption).toEqual(tabMenuData);
  });

  it('should update activeIndex on onActiveIndexChange call', () => {
    component.onActiveIndexChange(2);
    expect(component.activeIndex).toBe(2);
  });

  it('should have initial activeIndex as 0', () => {
    expect(component.activeIndex).toBe(0);
  });

  it('should render all section headings with hover-only anchor symbols', () => {
    sectionAnchorIds.forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render all widgets in full-width containers', () => {
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-12.flex.flex-column.gap-2 h3#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('breadcrumb');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('breadcrumb');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();
      spectator.click(`h3#${id} > a`);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h3#breadcrumb');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });
});
