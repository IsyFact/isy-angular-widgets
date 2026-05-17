import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {TerminalService} from 'primeng/terminal';
import {PrimengMiscComponent} from './primeng-misc.component';
import {storageData} from '../../data/product';

describe('Unit Tests: PrimengMiscComponent', () => {
  const sectionAnchorIds = [
    'chip',
    'tag',
    'avatar',
    'avatar-badge',
    'badge',
    'progressspinner',
    'progressbar',
    'metergroup',
    'skeleton-rectangle',
    'skeleton-rounded',
    'skeleton-square',
    'skeleton-circle',
    'inplace',
    'scrolltop',
    'blockui',
    'terminal'
  ];

  let component: PrimengMiscComponent;
  let spectator: Spectator<PrimengMiscComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengMiscComponent,
    providers: [
      TerminalService,
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

  it('should initialize storageStatus with storageData', () => {
    expect(component.storageStatus).toEqual(storageData);
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
    const fullWidthContainers = spectator.queryAll<HTMLElement>('.col-12.flex.flex-column.gap-2');

    expect(fullWidthContainers.length).toBeGreaterThanOrEqual(sectionAnchorIds.length);
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-12.flex.flex-column.gap-2 h3#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('chip');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('chip');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();

      spectator.click(`h3#${id} > a`);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h3#chip');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should set blockedContent to true on blockContent call', () => {
    component.blockContent();
    expect(component.blockedContent).toBe(true);
  });

  it('should set blockedContent to false on unblockContent call', () => {
    component.unblockContent();
    expect(component.blockedContent).toBe(false);
  });
});
