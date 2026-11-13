import {ViewportScroller} from '@angular/common';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {fakeAsync, tick} from '@angular/core/testing';
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
    'fieldset-toolbar',
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

  describe('Field group toolbar', () => {
    /**
     * Builds a click event whose `currentTarget` points to the given element.
     * @param currentTarget The element to report as the event's current target
     * @returns A `MouseEvent` with `currentTarget` overridden
     */
    function createClickEvent(currentTarget: HTMLElement): Event {
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'currentTarget', {value: currentTarget});
      return event;
    }

    it('should define the "Meldeadresse" and "Postanschrift" groups with Edit, Print, Delete in order', () => {
      expect(component.addressGroups).toHaveLength(2);

      const [registeredAddress, postalAddress] = component.addressGroups;

      expect(registeredAddress.id).toBe('meldeadresse');
      expect(registeredAddress.actions.map((action) => action.key)).toEqual(['edit', 'print', 'delete']);
      expect(registeredAddress.actions.every((action) => !action.disabled)).toBe(true);

      expect(postalAddress.id).toBe('postanschrift');
      expect(postalAddress.actions.map((action) => action.key)).toEqual(['edit', 'print', 'delete']);
      expect(postalAddress.actions.find((action) => action.key === 'edit')?.disabled).toBe(false);
      expect(postalAddress.actions.find((action) => action.key === 'print')?.disabled).toBe(true);
      expect(postalAddress.actions.find((action) => action.key === 'delete')?.disabled).toBe(true);
    });

    it('should define the overflow menu with Export, History and a disabled Archive entry', () => {
      expect(component.addressesOverflowItems).toHaveLength(3);
      expect(component.addressesOverflowItems[0].label).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarExport');
      expect(component.addressesOverflowItems[1].label).toBe(
        'isyAngularWidgetsDemo.labels.panelFieldsetToolbarHistory'
      );
      expect(component.addressesOverflowItems[2].label).toBe(
        'isyAngularWidgetsDemo.labels.panelFieldsetToolbarArchive'
      );
      expect(component.addressesOverflowItems[2].disabled).toBe(true);
    });

    it('should record the executed action and group, and restore focus to the triggering button', fakeAsync(() => {
      const button = document.createElement('button');
      spyOn(button, 'focus');

      component.runFieldGroupAction(
        createClickEvent(button),
        'isyAngularWidgetsDemo.labels.panelFieldsetToolbarEdit',
        'isyAngularWidgetsDemo.labels.panelFieldsetToolbarRegisteredAddress'
      );

      expect(component.lastToolbarActionKey).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarEdit');
      expect(component.lastToolbarGroupKey).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarRegisteredAddress');
      expect(button.focus).not.toHaveBeenCalled();

      tick();

      expect(button.focus).toHaveBeenCalled();
    }));

    it('should not throw when restoring focus without a triggering element', fakeAsync(() => {
      const event = new MouseEvent('click');

      expect(() => component.runFieldGroupAction(event, 'action', 'group')).not.toThrow();

      tick();
    }));

    it('should toggle the highlight state and record the highlight action on the "Adressen" group', fakeAsync(() => {
      const button = document.createElement('button');
      spyOn(button, 'focus');

      expect(component.addressesHighlighted).toBe(false);

      component.toggleAddressesHighlight(createClickEvent(button));

      expect(component.addressesHighlighted).toBe(true);
      expect(component.lastToolbarActionKey).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarHighlight');
      expect(component.lastToolbarGroupKey).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarAddresses');

      tick();

      expect(button.focus).toHaveBeenCalled();

      component.toggleAddressesHighlight(createClickEvent(button));

      expect(component.addressesHighlighted).toBe(false);

      tick();
    }));

    it('should run an overflow menu command and restore focus to the overflow trigger button', fakeAsync(() => {
      const overflowButton = spectator.query<HTMLButtonElement>(
        '[aria-haspopup="menu"][aria-controls="addresses-overflow-menu"]'
      );

      expect(overflowButton).toBeTruthy();
      spyOn(overflowButton as HTMLButtonElement, 'focus');

      component.addressesOverflowItems[0].command?.({originalEvent: new MouseEvent('click'), item: {}});

      expect(component.lastToolbarActionKey).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarExport');
      expect(component.lastToolbarGroupKey).toBe('isyAngularWidgetsDemo.labels.panelFieldsetToolbarAddresses');

      tick();

      expect(overflowButton?.focus).toHaveBeenCalled();
    }));

    it('should mark the "Adressen" and "Meldeadresse" labels as semantic headings', fakeAsync(() => {
      spectator.detectChanges();
      tick();
      spectator.detectChanges();

      const labels = spectator.queryAll('.p-fieldset-legend-label');
      const addressesLabel = labels.find((label) =>
        label.textContent?.trim().includes('panelFieldsetToolbarAddresses')
      );
      const registeredAddressLabel = labels.find((label) =>
        label.textContent?.trim().includes('panelFieldsetToolbarRegisteredAddress')
      );

      expect(addressesLabel?.getAttribute('role')).toBe('heading');
      expect(addressesLabel?.getAttribute('aria-level')).toBe('4');
      expect(registeredAddressLabel?.getAttribute('role')).toBe('heading');
      expect(registeredAddressLabel?.getAttribute('aria-level')).toBe('5');
    }));

    it('should expose role="toolbar" with an aria-label for the main group and both sub groups', () => {
      spectator.detectChanges();

      const toolbars = spectator.queryAll('div[role="toolbar"]');

      expect(toolbars).toHaveLength(3);
      toolbars.forEach((toolbar) => {
        expect(toolbar.hasAttribute('aria-label')).toBe(true);
      });
    });

    it('should render the disabled sub group actions as disabled instead of hiding them', () => {
      const postalAddressActions = component.addressGroups.find((group) => group.id === 'postanschrift')?.actions;

      expect(postalAddressActions?.filter((action) => action.disabled)).toHaveLength(2);
    });
  });
});
