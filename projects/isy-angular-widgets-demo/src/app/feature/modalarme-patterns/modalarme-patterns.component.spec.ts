import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {fakeAsync, flush, tick} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {MessageService} from 'primeng/api';
import {Popover} from 'primeng/popover';
import {ModalarmePatternsComponent, StepperStep} from './modalarme-patterns.component';
import {AnchorNavigationService} from '../../shared/services/anchor-navigation.service';

/**
 * Creates a minimal MouseEvent whose currentTarget is the given HTMLElement.
 * @param target The HTMLElement to set as the currentTarget of the MouseEvent
 * @returns A MouseEvent with the specified target
 */
function mouseEventWithTarget(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', {bubbles: true});
  Object.defineProperty(event, 'currentTarget', {value: target});

  return event;
}

/**
 * Provides access to protected component members for testing.
 */
interface ModalarmePatternsComponentTestAccess {
  isVerticalStepper: () => boolean;
}

/**
 * Returns whether the stepper is currently displayed vertically.
 * @param component The component whose responsive state should be read
 * @returns True when the stepper should be displayed vertically
 */
function getIsVerticalStepper(component: ModalarmePatternsComponent): boolean {
  return (component as unknown as ModalarmePatternsComponentTestAccess).isVerticalStepper();
}

/**
 * Completes the PrimeNG panel transition and the component's
 * animation-frame focus request.
 * @param spectator The component spectator used to trigger change detection
 */
function completeStepperRender(spectator: Spectator<ModalarmePatternsComponent>): void {
  spectator.detectComponentChanges();
  tick(400);

  spectator.detectComponentChanges();
  tick(16);

  spectator.detectComponentChanges();
}

describe('ModalarmePatternsComponent', () => {
  const sectionAnchorIds = ['h-stepper', 'h-drawer', 'h-confirm-bar', 'h-help-popover', 'h-help-expander', 'h-errors'];
  const verticalStepperMediaQuery = '(max-width: 320px)';

  let spectator: Spectator<ModalarmePatternsComponent>;
  let component: ModalarmePatternsComponent;
  let msgService: MessageService;
  let liveAnnouncer: jasmine.SpyObj<LiveAnnouncer>;
  let breakpointState$: Subject<BreakpointState>;

  const liveAnnouncerSpy = jasmine.createSpyObj<LiveAnnouncer>('LiveAnnouncer', ['announce']);
  liveAnnouncerSpy.announce.and.returnValue(Promise.resolve());

  const breakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', [
    'observe',
    'isMatched'
  ]);

  const fragment$ = new Subject<string | null>();

  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const anchorNavSpy = jasmine.createSpyObj<AnchorNavigationService>('AnchorNavigationService', [
    'initFragmentScroll',
    'scrollToAnchor'
  ]);

  const createComponent = createComponentFactory({
    component: ModalarmePatternsComponent,
    imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    providers: [
      FormBuilder,
      MessageService,
      {provide: LiveAnnouncer, useValue: liveAnnouncerSpy},
      {
        provide: ActivatedRoute,
        useValue: {fragment: fragment$.asObservable()}
      },
      {provide: ViewportScroller, useValue: viewportScrollerMock},
      {provide: AnchorNavigationService, useValue: anchorNavSpy},
      {provide: BreakpointObserver, useValue: breakpointObserverSpy}
    ],
    schemas: [NO_ERRORS_SCHEMA],
    declareComponent: false
  });

  beforeEach(() => {
    breakpointState$ = new Subject<BreakpointState>();

    breakpointObserverSpy.observe.calls.reset();
    breakpointObserverSpy.isMatched.calls.reset();
    breakpointObserverSpy.observe.and.returnValue(breakpointState$.asObservable());
    breakpointObserverSpy.isMatched.and.returnValue(false);

    liveAnnouncerSpy.announce.calls.reset();
    viewportScrollerMock.scrollToAnchor.calls.reset();
    anchorNavSpy.scrollToAnchor.calls.reset();
    anchorNavSpy.initFragmentScroll.calls.reset();

    spyOn(Element.prototype, 'getClientRects').and.returnValue({
      length: 1
    } as DOMRectList);

    spectator = createComponent();
    component = spectator.component;
    msgService = spectator.inject(MessageService);
    liveAnnouncer = liveAnnouncerSpy;

    spyOn(msgService, 'add');
  });

  describe('Initialisation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render all section headings as demo-section-heading elements with correct headingIds', () => {
      sectionAnchorIds.forEach((id) => {
        const element = spectator.query<HTMLElement>(`demo-section-heading[anchorId="${id}"]`);

        expect(element).withContext(id).toBeTruthy();
      });
    });

    it('should scroll to anchor after initialization when fragment is emitted', () => {
      expect(anchorNavSpy.initFragmentScroll).toHaveBeenCalled();
    });

    it('should delegate scrollToWidget to AnchorNavigationService.scrollToAnchor', () => {
      const event = new MouseEvent('click');

      component.scrollToWidget(event, 'h-stepper');

      expect(anchorNavSpy.scrollToAnchor).toHaveBeenCalledWith(event, 'h-stepper');
    });

    it('should not scroll when clicking only the heading text', () => {
      expect(anchorNavSpy.scrollToAnchor).not.toHaveBeenCalled();
    });

    it('should initialise stepValue to StepperStep.First', () => {
      expect(component.stepValue).toBe(StepperStep.First);
    });

    it('should initialise globalError to null', () => {
      expect(component.globalError).toBeNull();
    });

    it('should initialise panelOpen to false', () => {
      expect(component.panelOpen).toBeFalse();
    });

    it('should initialise showConfirmBar to false', () => {
      expect(component.showConfirmBar).toBeFalse();
    });

    it('should initialise helpOpen to false', () => {
      expect(component.helpOpen).toBeFalse();
    });

    it('should initialise helpPopoverId', () => {
      expect(component.helpPopoverId).toBe('help-popover-panel');
    });
  });

  describe('Responsive stepper', () => {
    it('should observe the configured vertical stepper breakpoint', () => {
      expect(breakpointObserverSpy.observe).toHaveBeenCalledOnceWith(verticalStepperMediaQuery);
      expect(breakpointObserverSpy.isMatched).toHaveBeenCalledOnceWith(verticalStepperMediaQuery);
    });

    it('should initialise the stepper horizontally when the breakpoint does not match', () => {
      expect(getIsVerticalStepper(component)).toBeFalse();
    });

    it('should initialise the stepper vertically when the breakpoint already matches', () => {
      spectator.fixture.destroy();

      breakpointState$ = new Subject<BreakpointState>();

      breakpointObserverSpy.observe.calls.reset();
      breakpointObserverSpy.isMatched.calls.reset();
      breakpointObserverSpy.observe.and.returnValue(breakpointState$.asObservable());
      breakpointObserverSpy.isMatched.and.returnValue(true);

      spectator = createComponent();
      component = spectator.component;

      expect(getIsVerticalStepper(component)).toBeTrue();
    });

    it('should switch to a vertical stepper when the breakpoint starts matching', () => {
      breakpointState$.next({
        matches: true,
        breakpoints: {
          [verticalStepperMediaQuery]: true
        }
      });

      spectator.detectComponentChanges();

      expect(getIsVerticalStepper(component)).toBeTrue();
    });

    it('should switch back to a horizontal stepper when the breakpoint no longer matches', () => {
      breakpointState$.next({
        matches: true,
        breakpoints: {
          [verticalStepperMediaQuery]: true
        }
      });

      spectator.detectComponentChanges();

      expect(getIsVerticalStepper(component)).toBeTrue();

      breakpointState$.next({
        matches: false,
        breakpoints: {
          [verticalStepperMediaQuery]: false
        }
      });

      spectator.detectComponentChanges();

      expect(getIsVerticalStepper(component)).toBeFalse();
    });
  });

  describe('Forms', () => {
    describe('formStepper', () => {
      it('should contain a "base" group with an "id" control', () => {
        expect(component.baseFg).toBeInstanceOf(FormGroup);
        expect(component.baseFg.controls.id).toBeTruthy();
      });

      it('should require the "id" field', () => {
        const idControl = component.baseFg.controls.id;

        idControl.setValue('');

        expect(idControl.valid).toBeFalse();

        idControl.setValue('ABC-123');

        expect(idControl.valid).toBeTrue();
      });

      it('should contain a "details" group with firstname, lastname and gender', () => {
        expect(component.detailsFg).toBeInstanceOf(FormGroup);
        expect(component.detailsFg.controls.firstname).toBeTruthy();
        expect(component.detailsFg.controls.lastname).toBeTruthy();
        expect(component.detailsFg.controls.gender).toBeTruthy();
      });

      it('should report the details group as valid when no validators are set', () => {
        expect(component.detailsFg.valid).toBeTrue();
      });
    });

    describe('formEdit', () => {
      it('should require geburtsname', () => {
        const control = component.formEdit.controls.geburtsname;

        control.setValue('');

        expect(control.valid).toBeFalse();

        control.setValue('Müller');

        expect(control.valid).toBeTrue();
      });
    });

    describe('formErrors', () => {
      it('should require geburtsname', () => {
        const control = component.formErrors.controls.geburtsname;

        control.setValue('');

        expect(control.valid).toBeFalse();

        control.setValue('Schmidt');

        expect(control.valid).toBeTrue();
      });
    });
  });

  describe('Stepper', () => {
    describe('goNext()', () => {
      it('should go to the target step when the current group is valid', () => {
        component.baseFg.controls.id.setValue('X-1');

        component.goNext(StepperStep.Second, component.baseFg);

        expect(component.stepValue).toBe(StepperStep.Second);
        expect(component.globalError).toBeNull();
      });

      it('should clear an existing globalError when the group becomes valid', () => {
        component.globalError = 'Old error';
        component.baseFg.controls.id.setValue('Y-2');

        component.goNext(StepperStep.Second, component.baseFg);

        expect(component.globalError).toBeNull();
        expect(component.stepValue).toBe(StepperStep.Second);
      });

      it('should focus the first field after moving from the first to the second step', fakeAsync(() => {
        component.baseFg.controls.id.setValue('X-1');

        component.goNext(StepperStep.Second, component.baseFg);
        completeStepperRender(spectator);

        const firstnameInput = spectator.query<HTMLInputElement>('#firstname');

        expect(firstnameInput).toBeTruthy();
        expect(document.activeElement).toBe(firstnameInput);
      }));

      it('should focus the first field after moving to the second step in the vertical stepper', fakeAsync(() => {
        breakpointState$.next({
          matches: true,
          breakpoints: {
            [verticalStepperMediaQuery]: true
          }
        });

        spectator.detectComponentChanges();

        component.baseFg.controls.id.setValue('X-1');

        component.goNext(StepperStep.Second, component.baseFg);
        completeStepperRender(spectator);

        const firstnameInput = spectator.query<HTMLInputElement>('#firstname');

        expect(getIsVerticalStepper(component)).toBeTrue();
        expect(firstnameInput).toBeTruthy();
        expect(document.activeElement).toBe(firstnameInput);
      }));

      it('should mark controls as touched and keep current step when the group is invalid', () => {
        component.goNext(StepperStep.Second, component.baseFg);

        expect(component.baseFg.controls.id.touched).toBeTrue();
        expect(component.stepValue).toBe(StepperStep.First);
        expect(component.globalError).toBe('Bitte korrigieren Sie die markierten Felder.');
      });

      it('should announce the global error when validation fails', () => {
        component.goNext(StepperStep.Second, component.baseFg);

        expect(liveAnnouncer.announce).toHaveBeenCalledWith(
          'Bitte korrigieren Sie die markierten Felder.',
          'assertive'
        );
      });
    });

    describe('goBack()', () => {
      it('should set the target step and clear globalError', () => {
        component.stepValue = StepperStep.Second;
        component.globalError = 'Old error';

        component.goBack(StepperStep.First);

        expect(component.stepValue as StepperStep).toBe(StepperStep.First);
        expect(component.globalError).toBeNull();
      });

      it('should focus the first field after moving from the second to the first step', fakeAsync(() => {
        component.baseFg.controls.id.setValue('X-1');

        component.goNext(StepperStep.Second, component.baseFg);
        completeStepperRender(spectator);

        expect(component.stepValue).toBe(StepperStep.Second);

        component.goBack(StepperStep.First);
        completeStepperRender(spectator);

        const idInput = spectator.query<HTMLInputElement>('#id');

        expect(component.stepValue).toBe(StepperStep.First);
        expect(idInput).toBeTruthy();
        expect(document.activeElement).toBe(idInput);
      }));

      it('should focus the first field after moving from the third to the second step', fakeAsync(() => {
        component.baseFg.controls.id.setValue('X-1');

        component.goNext(StepperStep.Second, component.baseFg);
        completeStepperRender(spectator);

        component.goNext(StepperStep.Third, component.detailsFg);
        completeStepperRender(spectator);

        expect(component.stepValue).toBe(StepperStep.Third);

        component.goBack(StepperStep.Second);
        completeStepperRender(spectator);

        const firstnameInput = spectator.query<HTMLInputElement>('#firstname');

        expect(component.stepValue).toBe(StepperStep.Second);
        expect(firstnameInput).toBeTruthy();
        expect(document.activeElement).toBe(firstnameInput);
      }));

      it('should focus the first field after moving back in the vertical stepper', fakeAsync(() => {
        breakpointState$.next({
          matches: true,
          breakpoints: {
            [verticalStepperMediaQuery]: true
          }
        });

        spectator.detectComponentChanges();

        expect(getIsVerticalStepper(component)).toBeTrue();

        component.baseFg.controls.id.setValue('X-1');

        component.goNext(StepperStep.Second, component.baseFg);
        completeStepperRender(spectator);

        expect(component.stepValue).toBe(StepperStep.Second);

        component.goBack(StepperStep.First);
        completeStepperRender(spectator);

        const idInput = spectator.query<HTMLInputElement>('#id');

        expect(component.stepValue).toBe(StepperStep.First);
        expect(idInput).toBeTruthy();
        expect(document.activeElement).toBe(idInput);
      }));
    });

    describe('saveStepper()', () => {
      it('should set globalError when formStepper is invalid', () => {
        component.saveStepper();

        expect(component.globalError).toBe('Bitte vervollständigen Sie alle Pflichtfelder.');
      });

      it('should mark all controls as touched when formStepper is invalid', () => {
        component.baseFg.controls.id.setValue('');

        component.saveStepper();

        expect(component.baseFg.controls.id.touched).toBeTrue();
      });

      it('should announce the global error when formStepper is invalid', () => {
        component.saveStepper();

        expect(liveAnnouncer.announce).toHaveBeenCalledWith(
          'Bitte vervollständigen Sie alle Pflichtfelder.',
          'assertive'
        );
      });

      it('should show a success toast and clear globalError when formStepper is valid', () => {
        component.baseFg.controls.id.setValue('OK-1');
        component.globalError = 'Old error';

        component.saveStepper();

        expect(component.globalError).toBeNull();
        expect(msgService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'success',
            summary: 'Gespeichert',
            detail: 'Objekt angelegt.'
          })
        );
      });

      it('should not announce an error when formStepper is valid', () => {
        component.baseFg.controls.id.setValue('OK-1');

        component.saveStepper();

        expect(liveAnnouncer.announce).not.toHaveBeenCalled();
      });
    });
  });

  describe('isStepFieldInvalid()', () => {
    it('should return false when the control is untouched and pristine', () => {
      expect(component.isStepFieldInvalid('base', 'id')).toBeFalse();
    });

    it('should return true when the control is invalid and touched', () => {
      const control = component.baseFg.controls.id;

      control.setValue('');
      control.markAsTouched();

      expect(component.isStepFieldInvalid('base', 'id')).toBeTrue();
    });

    it('should return true when the control is invalid and dirty', () => {
      const control = component.baseFg.controls.id;

      control.setValue('');
      control.markAsDirty();

      expect(component.isStepFieldInvalid('base', 'id')).toBeTrue();
    });

    it('should return false when the control is valid even if touched', () => {
      const control = component.baseFg.controls.id;

      control.setValue('ABC');
      control.markAsTouched();

      expect(component.isStepFieldInvalid('base', 'id')).toBeFalse();
    });

    it('should resolve controls in the details group correctly', () => {
      const control = component.detailsFg.controls.firstname;

      control.markAsTouched();

      expect(component.isStepFieldInvalid('details', 'firstname')).toBeFalse();
    });

    it('should return false for a non-existent control name', () => {
      expect(component.isStepFieldInvalid('base', 'nonexistent')).toBeFalse();
    });
  });

  describe('Drawer', () => {
    describe('openPanel()', () => {
      it('should set panelOpen to true', () => {
        const trigger = document.createElement('button');

        component.openPanel(mouseEventWithTarget(trigger));

        expect(component.panelOpen).toBeTrue();
      });

      it('should open the panel even when currentTarget is not an HTMLElement', () => {
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'currentTarget', {value: null});

        component.openPanel(event);

        expect(component.panelOpen).toBeTrue();
      });
    });

    describe('closePanel()', () => {
      it('should set panelOpen to false', () => {
        component.panelOpen = true;

        component.closePanel();

        expect(component.panelOpen).toBeFalse();
      });
    });

    describe('saveEdit()', () => {
      it('should not close the panel when formEdit is invalid', () => {
        component.panelOpen = true;
        component.formEdit.controls.geburtsname.setValue('');

        component.saveEdit();

        expect(component.panelOpen).toBeTrue();
      });

      it('should mark geburtsname as touched when formEdit is invalid', () => {
        component.panelOpen = true;
        component.formEdit.controls.geburtsname.setValue('');

        component.saveEdit();

        expect(component.formEdit.controls.geburtsname.touched).toBeTrue();
      });

      it('should close the panel when formEdit is valid', () => {
        component.panelOpen = true;
        component.formEdit.controls.geburtsname.setValue('Müller');

        component.saveEdit();

        expect(component.panelOpen).toBeFalse();
      });
    });

    describe('onEscapeKey()', () => {
      it('should do nothing when the panel is already closed', () => {
        component.panelOpen = false;

        component.onEscapeKey();

        expect(component.panelOpen).toBeFalse();
      });

      it('should close the panel when it is open', () => {
        component.panelOpen = true;

        component.onEscapeKey();

        expect(component.panelOpen).toBeFalse();
      });
    });
  });

  describe('Inline confirm bar', () => {
    describe('askDeleteBar()', () => {
      it('should set showConfirmBar to true', () => {
        component.askDeleteBar();

        expect(component.showConfirmBar).toBeTrue();
      });

      it('should be idempotent when called twice', () => {
        component.askDeleteBar();
        component.askDeleteBar();

        expect(component.showConfirmBar).toBeTrue();
      });

      it('should keep state unchanged when already open', () => {
        component.showConfirmBar = true;

        component.askDeleteBar();

        expect(component.showConfirmBar).toBeTrue();
      });
    });

    describe('cancelDeleteBar()', () => {
      it('should set showConfirmBar to false', () => {
        component.showConfirmBar = true;

        component.cancelDeleteBar();

        expect(component.showConfirmBar).toBeFalse();
      });
    });

    describe('confirmDeleteBar()', () => {
      it('should set showConfirmBar to false', () => {
        component.showConfirmBar = true;

        component.confirmDeleteBar();

        expect(component.showConfirmBar).toBeFalse();
      });

      it('should show a warning toast with the correct message', () => {
        component.confirmDeleteBar();

        expect(msgService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'warn',
            summary: 'Gelöscht',
            detail: 'Das Objekt wurde gelöscht.',
            life: 6000
          })
        );
      });
    });
  });

  describe('Popover', () => {
    it('should delegate toggleHelp to helpOverlay.toggle', () => {
      const toggleSpy = jasmine.createSpy('toggle');
      component.helpOverlay = {toggle: toggleSpy} as unknown as Popover;

      const event = new MouseEvent('click');

      component.toggleHelp(event);

      expect(toggleSpy).toHaveBeenCalledWith(event);
    });

    it('should delegate closeHelp to helpOverlay.hide', () => {
      const hideSpy = jasmine.createSpy('hide');
      component.helpOverlay = {hide: hideSpy} as unknown as Popover;

      component.closeHelp();

      expect(hideSpy).toHaveBeenCalled();
    });

    it('should set helpOpen to true in onHelpShow', () => {
      component.helpOpen = false;

      component.onHelpShow();

      expect(component.helpOpen).toBeTrue();
    });

    it('should set helpOpen to false in onHelpHide', () => {
      component.helpOpen = true;

      component.onHelpHide();

      expect(component.helpOpen).toBeFalse();
    });
  });

  describe('isInvalid()', () => {
    it('should return false when the control is untouched', () => {
      expect(component.isInvalid('geburtsname')).toBeFalse();
    });

    it('should return true when the control is invalid and touched', () => {
      const control = component.formErrors.controls.geburtsname;

      control.setValue('');
      control.markAsTouched();

      expect(component.isInvalid('geburtsname')).toBeTrue();
    });

    it('should return true when the control is invalid and dirty', () => {
      const control = component.formErrors.controls.geburtsname;

      control.setValue('');
      control.markAsDirty();

      expect(component.isInvalid('geburtsname')).toBeTrue();
    });

    it('should return false when the control is valid even if touched', () => {
      const control = component.formErrors.controls.geburtsname;

      control.setValue('Meier');
      control.markAsTouched();

      expect(component.isInvalid('geburtsname')).toBeFalse();
    });

    it('should return false for a non-existent control name', () => {
      expect(component.isInvalid('nonexistent')).toBeFalse();
    });
  });

  describe('submitErrors()', () => {
    it('should show an error toast and mark controls as touched when the form is invalid', () => {
      component.formErrors.controls.geburtsname.setValue('');

      component.submitErrors();

      expect(component.formErrors.controls.geburtsname.touched).toBeTrue();
      expect(msgService.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          summary: 'Eingaben prüfen',
          detail: 'Bitte korrigieren Sie die markierten Felder.',
          life: 6000
        })
      );
    });

    it('should show a success toast when the form is valid', () => {
      component.formErrors.controls.geburtsname.setValue('Schmidt');

      component.submitErrors();

      expect(msgService.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'success',
          summary: 'Gespeichert',
          detail: 'Daten wurden gespeichert.',
          life: 4000
        })
      );
    });

    it('should not emit a success toast when the form is invalid', () => {
      component.formErrors.controls.geburtsname.setValue('');

      component.submitErrors();

      expect(msgService.add).toHaveBeenCalledTimes(1);

      const lastArguments = (msgService.add as jasmine.Spy).calls.mostRecent().args[0];

      expect(lastArguments.severity).toBe('error');
    });
  });

  describe('Accessibility in the template', () => {
    it('should render an aria-live="polite" region for the confirm bar', () => {
      const liveRegion = spectator.query('[aria-live="polite"]');

      expect(liveRegion).toBeTruthy();
    });

    it('should have no duplicate IDs in the DOM', () => {
      const allIds = spectator
        .queryAll('[id]')
        .map((element) => element.id)
        .filter(Boolean);

      const uniqueIds = new Set(allIds);

      expect(allIds.length).toBe(uniqueIds.size);
    });
  });
});
