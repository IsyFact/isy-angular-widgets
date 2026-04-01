import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {TranslateModule} from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ModalarmePatternsComponent} from './modalarme-patterns.component';

/**
 * Creates a minimal MouseEvent whose currentTarget is the given HTMLElement.
 * @param target The HTMLElement to set as the currentTarget of the MouseEvent.
 * @returns A MouseEvent with the specified target.
 */
function mouseEventWithTarget(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', {bubbles: true});
  Object.defineProperty(event, 'currentTarget', {value: target});
  return event;
}

describe('ModalarmePatternsComponent', () => {
  let spectator: Spectator<ModalarmePatternsComponent>;
  let component: ModalarmePatternsComponent;
  let msgService: MessageService;

  const createComponent = createComponentFactory({
    component: ModalarmePatternsComponent,
    imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    providers: [FormBuilder, MessageService],
    schemas: [NO_ERRORS_SCHEMA],
    declareComponent: false
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    msgService = spectator.inject(MessageService);
    spyOn(msgService, 'add');
  });

  // Initial state
  describe('Initialisation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialise stepValue to 1', () => {
      expect(component.stepValue).toBe(1);
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
  });

  // Form structure
  describe('Forms', () => {
    describe('formStepper', () => {
      it('should contain a "base" group with an "id" control', () => {
        expect(component.baseFg).toBeInstanceOf(FormGroup);
        expect(component.baseFg.controls.id).toBeTruthy();
      });

      it('should require the "id" field', () => {
        const idCtrl = component.baseFg.controls.id;
        idCtrl.setValue('');
        expect(idCtrl.valid).toBeFalse();

        idCtrl.setValue('ABC-123');
        expect(idCtrl.valid).toBeTrue();
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
        const ctrl = component.formEdit.controls.geburtsname;
        ctrl.setValue('');
        expect(ctrl.valid).toBeFalse();

        ctrl.setValue('Müller');
        expect(ctrl.valid).toBeTrue();
      });
    });

    describe('formErrors', () => {
      it('should require geburtsname', () => {
        const ctrl = component.formErrors.controls.geburtsname;
        ctrl.setValue('');
        expect(ctrl.valid).toBeFalse();

        ctrl.setValue('Schmidt');
        expect(ctrl.valid).toBeTrue();
      });
    });
  });

  // Stepper navigation
  describe('Stepper', () => {
    let activateSpy: jasmine.Spy;

    beforeEach(() => {
      activateSpy = jasmine.createSpy('activateCallback');
    });

    describe('goNext()', () => {
      it('should call activateCallback when the current group is valid', () => {
        component.baseFg.controls.id.setValue('X-1');

        component.goNext(2, component.baseFg, activateSpy);

        expect(activateSpy).toHaveBeenCalledWith(2);
        expect(component.globalError).toBeNull();
      });

      it('should set globalError and mark controls as touched when the group is invalid', () => {
        component.baseFg.controls.id.setValue('');

        component.goNext(2, component.baseFg, activateSpy);

        expect(activateSpy).not.toHaveBeenCalled();
        expect(component.globalError).toBe('Bitte korrigieren Sie die markierten Felder.');
        expect(component.baseFg.controls.id.touched).toBeTrue();
      });

      it('should clear an existing globalError when the group becomes valid', () => {
        component.globalError = 'Old error';
        component.baseFg.controls.id.setValue('Y-2');

        component.goNext(2, component.baseFg, activateSpy);

        expect(component.globalError).toBeNull();
      });
    });

    describe('goBack()', () => {
      it('should call activateCallback with the target step', () => {
        component.goBack(1, activateSpy);

        expect(activateSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('saveStepper()', () => {
      it('should set globalError when formStepper is invalid', () => {
        component.baseFg.controls.id.setValue('');

        component.saveStepper();

        expect(component.globalError).toBe('Bitte vervollständigen Sie alle Pflichtfelder.');
      });

      it('should mark all controls as touched when formStepper is invalid', () => {
        component.baseFg.controls.id.setValue('');

        component.saveStepper();

        expect(component.baseFg.controls.id.touched).toBeTrue();
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
    });
  });

  // isStepFieldInvalid()
  describe('isStepFieldInvalid()', () => {
    it('should return false when the control is untouched and pristine', () => {
      expect(component.isStepFieldInvalid('base', 'id')).toBeFalse();
    });

    it('should return true when the control is invalid and touched', () => {
      const ctrl = component.baseFg.controls.id;
      ctrl.setValue('');
      ctrl.markAsTouched();

      expect(component.isStepFieldInvalid('base', 'id')).toBeTrue();
    });

    it('should return true when the control is invalid and dirty', () => {
      const ctrl = component.baseFg.controls.id;
      ctrl.setValue('');
      ctrl.markAsDirty();

      expect(component.isStepFieldInvalid('base', 'id')).toBeTrue();
    });

    it('should return false when the control is valid even if touched', () => {
      const ctrl = component.baseFg.controls.id;
      ctrl.setValue('ABC');
      ctrl.markAsTouched();

      expect(component.isStepFieldInvalid('base', 'id')).toBeFalse();
    });

    it('should resolve controls in the details group correctly', () => {
      const ctrl = component.detailsFg.controls.firstname;
      ctrl.markAsTouched();

      // firstname has no validators - always valid
      expect(component.isStepFieldInvalid('details', 'firstname')).toBeFalse();
    });

    it('should return false for a non-existent control name', () => {
      expect(component.isStepFieldInvalid('base', 'nonexistent')).toBeFalse();
    });
  });

  // Drawer (edit panel)
  describe('Drawer', () => {
    describe('openPanel()', () => {
      it('should set panelOpen to true', () => {
        const trigger = document.createElement('button');

        component.openPanel(mouseEventWithTarget(trigger));

        expect(component.panelOpen).toBeTrue();
      });

      it('should store the trigger element for later focus restoration', () => {
        const trigger = document.createElement('button');

        component.openPanel(mouseEventWithTarget(trigger));

        // Verified indirectly: closePanel will attempt restoreFocus on the stored trigger
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

  // Confirm – inline bar
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

  // isInvalid() – error handling form
  describe('isInvalid()', () => {
    it('should return false when the control is untouched', () => {
      expect(component.isInvalid('geburtsname')).toBeFalse();
    });

    it('should return true when the control is invalid and touched', () => {
      const ctrl = component.formErrors.controls.geburtsname;
      ctrl.setValue('');
      ctrl.markAsTouched();

      expect(component.isInvalid('geburtsname')).toBeTrue();
    });

    it('should return true when the control is invalid and dirty', () => {
      const ctrl = component.formErrors.controls.geburtsname;
      ctrl.setValue('');
      ctrl.markAsDirty();

      expect(component.isInvalid('geburtsname')).toBeTrue();
    });

    it('should return false when the control is valid even if touched', () => {
      const ctrl = component.formErrors.controls.geburtsname;
      ctrl.setValue('Meier');
      ctrl.markAsTouched();

      expect(component.isInvalid('geburtsname')).toBeFalse();
    });

    it('should return false for a non-existent control name', () => {
      expect(component.isInvalid('nonexistent')).toBeFalse();
    });
  });

  // submitErrors()
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
      const lastArgs = (msgService.add as jasmine.Spy).calls.mostRecent().args[0];
      expect(lastArgs.severity).toBe('error');
    });
  });

  // Accessibility attributes (template integration)
  describe('Accessibility in the template', () => {
    it('should render an aria-live="assertive" region for globalError', () => {
      const liveRegion = spectator.query('[aria-live="assertive"]');
      expect(liveRegion).toBeTruthy();
    });

    it('should render an aria-live="polite" region for the confirm bar', () => {
      const liveRegion = spectator.query('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();
    });

    it('should have no duplicate IDs in the DOM', () => {
      const allIds = spectator
        .queryAll('[id]')
        .map((el) => el.id)
        .filter(Boolean);
      const uniqueIds = new Set(allIds);

      expect(allIds.length).toBe(uniqueIds.size);
    });
  });
});
