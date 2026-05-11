import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengPanelComponent} from './primeng-panel.component';
import {TranslateModule} from '@ngx-translate/core';

describe('Unit Tests: PrimengPanelComponent', () => {
  const widgetAnchorIds = [
    'accordion',
    'panel',
    'tabs',
    'card',
    'fieldset',
    'scrollpanel',
    'splitter',
    'divider',
    'toolbar',
    'stepper'
  ];

  let component: PrimengPanelComponent;
  let spectator: Spectator<PrimengPanelComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengPanelComponent,
    imports: [TranslateModule.forRoot()],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {fragment: fragment$.asObservable()}
      },
      {
        provide: ViewportScroller,
        useValue: viewportScrollerMock
      }
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

  it('should expose a linkable heading per widget', () => {
    const headingLinks = spectator.queryAll<HTMLAnchorElement>('h3 > a');

    expect(headingLinks).toHaveLength(widgetAnchorIds.length);

    widgetAnchorIds.forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchorLink = spectator.query<HTMLAnchorElement>(`h3#${id} > a[href="#${id}"]`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchorLink).toBeTruthy();
      expect(anchorLink?.classList.contains('section-anchor')).toBeTrue();
      expect(anchorLink?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render widgets in a single-column layout', () => {
    expect(spectator.queryAll('[class*="xl:col-6"]')).toHaveLength(0);
  });

  it('should scroll to the fragment anchor after initialization', () => {
    fragment$.next('accordion');

    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('accordion');
  });

  it('should scroll to a widget when anchor symbol is clicked', () => {
    spectator.click('h3#accordion > a[href="#accordion"]');

    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('accordion');
  });

  it('should not scroll when clicking only the section heading text', () => {
    spectator.click('h3#accordion');

    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should delegate scrollToWidget to anchor navigation service', () => {
    const event = new MouseEvent('click');

    component.scrollToWidget(event, 'accordion');

    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('accordion');
  });

  it('should render standard and scrollable tab examples', () => {
    const tabs = spectator.queryAll('p-tabs');
    const renderedTabButtons = spectator.queryAll('[role="tab"]');

    expect(tabs.length).toBeGreaterThanOrEqual(2);
    expect(component.standardTabs.length).toBe(3);
    expect(component.scrollableTabs.length).toBe(30);
    expect(renderedTabButtons.length).toBeGreaterThanOrEqual(
      component.standardTabs.length + component.scrollableTabs.length
    );
    expect(spectator.query('.pi.pi-home')).toBeTruthy();
  });
});
