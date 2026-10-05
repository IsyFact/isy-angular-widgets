import {ViewportScroller} from '@angular/common';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {createComponentFactory, Spectator, createSpyObject} from '@ngneat/spectator/vitest';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {PrimengPanelComponent} from './primeng-panel.component';

/**
 * Provides access to protected component members for testing.
 */
interface PrimengPanelComponentTestAccess {
  isVerticalStepper: () => boolean;
}

/**
 * Returns whether the stepper is currently displayed vertically.
 * @param component The component whose responsive state should be read
 * @returns True when the stepper should be displayed vertically
 */
function getIsVerticalStepper(component: PrimengPanelComponent): boolean {
  return (component as unknown as PrimengPanelComponentTestAccess).isVerticalStepper();
}

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
  const verticalStepperMediaQuery = '(max-width: 320px)';

  let component: PrimengPanelComponent;
  let spectator: Spectator<PrimengPanelComponent>;
  let breakpointState$: Subject<BreakpointState>;

  const fragment$ = new Subject<string | null>();

  const viewportScrollerMock = {
    scrollToAnchor: vi.fn()
  };

  const breakpointObserverSpy = createSpyObject(BreakpointObserver);

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
      },
      {
        provide: BreakpointObserver,
        useValue: breakpointObserverSpy
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  beforeEach(() => {
    breakpointState$ = new Subject<BreakpointState>();

    breakpointObserverSpy.observe.mockClear();
    breakpointObserverSpy.isMatched.mockClear();
    breakpointObserverSpy.observe.mockReturnValue(breakpointState$.asObservable());
    breakpointObserverSpy.isMatched.mockReturnValue(false);

    viewportScrollerMock.scrollToAnchor.mockClear();

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
      const anchorLink = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBe(true);
      expect(anchorLink).toBeTruthy();
      expect(anchorLink?.classList.contains('section-anchor')).toBe(true);
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
    spectator.click('h3#accordion > a.section-anchor');

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

  it('should preserve the current state of interactive containers for print', () => {
    const statefulContainers = spectator.queryAll(
      'p-accordion.isy-print-current-state, p-panel.isy-print-current-state, ' +
        'p-tabs.isy-print-current-state, p-stepper.isy-print-current-state'
    );

    expect(statefulContainers).toHaveLength(5);
    expect(spectator.queryAll('p-tabpanel:not([hidden])')).toHaveLength(2);
    expect(spectator.queryAll('p-tabpanel[hidden]').length).toBeGreaterThan(0);
    expect(spectator.query('p-fieldset form.isy-print-form')).toBeTruthy();
    expect(spectator.query('p-stepper .isy-print-hide')).toBeTruthy();
  });

  describe('Responsive stepper', () => {
    it('should observe the configured vertical stepper breakpoint', () => {
      expect(breakpointObserverSpy.observe).toHaveBeenCalledExactlyOnceWith(verticalStepperMediaQuery);
      expect(breakpointObserverSpy.isMatched).toHaveBeenCalledExactlyOnceWith(verticalStepperMediaQuery);
    });

    it('should initialise the stepper horizontally when the breakpoint does not match', () => {
      expect(getIsVerticalStepper(component)).toBe(false);
    });

    it('should initialise the stepper vertically when the breakpoint already matches', () => {
      spectator.fixture.destroy();

      breakpointState$ = new Subject<BreakpointState>();
      breakpointObserverSpy.observe.mockClear();
      breakpointObserverSpy.isMatched.mockClear();
      breakpointObserverSpy.observe.mockReturnValue(breakpointState$.asObservable());
      breakpointObserverSpy.isMatched.mockReturnValue(true);

      spectator = createComponent();
      component = spectator.component;

      expect(getIsVerticalStepper(component)).toBe(true);
    });

    it('should switch to a vertical stepper when the breakpoint starts matching', () => {
      breakpointState$.next({
        matches: true,
        breakpoints: {
          [verticalStepperMediaQuery]: true
        }
      });

      spectator.detectChanges();

      expect(getIsVerticalStepper(component)).toBe(true);
    });

    it('should switch back to a horizontal stepper when the breakpoint no longer matches', () => {
      breakpointState$.next({
        matches: true,
        breakpoints: {
          [verticalStepperMediaQuery]: true
        }
      });

      spectator.detectChanges();

      expect(getIsVerticalStepper(component)).toBe(true);

      breakpointState$.next({
        matches: false,
        breakpoints: {
          [verticalStepperMediaQuery]: false
        }
      });

      spectator.detectChanges();

      expect(getIsVerticalStepper(component)).toBe(false);
    });
  });

  describe('Stepper navigation', () => {
    it('should initialise the stepper with the first step', () => {
      expect(component.stepperValue).toBe(1);
    });

    it('should navigate to the selected step', () => {
      component.goToStepperStep(2);

      expect(component.stepperValue).toBe(2);

      component.goToStepperStep(3);

      expect(component.stepperValue).toBe(3);
    });

    it('should preserve the active step when switching to the vertical stepper', () => {
      component.goToStepperStep(2);

      breakpointState$.next({
        matches: true,
        breakpoints: {
          [verticalStepperMediaQuery]: true
        }
      });

      spectator.detectChanges();

      expect(getIsVerticalStepper(component)).toBe(true);
      expect(component.stepperValue).toBe(2);
    });

    it('should preserve the active step when switching back to the horizontal stepper', () => {
      component.goToStepperStep(3);

      breakpointState$.next({
        matches: true,
        breakpoints: {
          [verticalStepperMediaQuery]: true
        }
      });

      spectator.detectChanges();

      breakpointState$.next({
        matches: false,
        breakpoints: {
          [verticalStepperMediaQuery]: false
        }
      });

      spectator.detectChanges();

      expect(getIsVerticalStepper(component)).toBe(false);
      expect(component.stepperValue).toBe(3);
    });
  });
});
