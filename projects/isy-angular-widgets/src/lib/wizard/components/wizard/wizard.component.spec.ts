<<<<<<< HEAD
import {ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
=======
import {ComponentFixture} from '@angular/core/testing';
>>>>>>> origin
import {WizardComponent} from './wizard.component';
import {WizardDirective} from '../../directives/wizard.directive';
import {RouterTestingModule} from '@angular/router/testing';
<<<<<<< HEAD
import {Component, QueryList, ViewChild} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {WizardModule} from '../../wizard.module';
import {MockComponent} from 'ng-mocks';
import {IncompleteDateComponent} from '../../../incomplete-date/incomplete-date.component';
=======
import {Component, QueryList, SimpleChange, ViewChild} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {WizardModule} from '../../wizard.module';
import {IncompleteDateModule} from '../../../incomplete-date/incomplete-date.module';
import {MenuItem} from 'primeng/api';
import {MockComponents} from 'ng-mocks';
import {Dialog} from 'primeng/dialog';
import {Steps} from 'primeng/steps';

const stepperItems: MenuItem[] = [
  {
    label: 'Auswahl 1'
  },
  {
    label: 'Auswahl 1'
  },
  {
    label: 'Auswahl 1'
  }
];
const stepsNumber: number = stepperItems.length;
>>>>>>> origin

const width = 50;
const height = 30;
const headerTitle = 'Wizard Title';
const childrenLabels = ['Auswahl 1', 'Auswahl 2', 'Auswahl 3'];
const startIndex = 0;

const backButtonDeclaration = '#back-button';
const nextButtonDeclaration = '#next-button';
const saveButtonDeclaration = '#save-button';
const closeButtonDeclaration = '#close-button';

@Component({
  template: ` <isy-wizard
    #wizard
    [width]="${width}"
    [height]="${height}"
    [headerTitle]="'${headerTitle}'"
    [isVisible]="true"
    [allowNext]="false"
  >
    <isy-incomplete-date *isyWizardDirective="'${childrenLabels[0]}'"></isy-incomplete-date>
    <isy-incomplete-date *isyWizardDirective="'${childrenLabels[1]}'"></isy-incomplete-date>
    <isy-incomplete-date *isyWizardDirective="'${childrenLabels[childrenLabels.length - 1]}'"></isy-incomplete-date>
  </isy-wizard>`
})
class TestComponent {
  @ViewChild('wizard') wizard!: WizardComponent;
}

let wizard: WizardComponent;
let contentChildren: QueryList<WizardDirective>;
let fixture: ComponentFixture<TestComponent>;
<<<<<<< HEAD

describe('Integration Tests: WizardComponent with Mock Parent', () => {
  let spectator: Spectator<TestComponent>;
  const createdComponent = createComponentFactory({
    component: TestComponent,
    imports: [WizardModule, RouterTestingModule],
    declarations: [MockComponent(IncompleteDateComponent)]
=======

/**
 * Checks if the next button is active
 * @param isAllowed State of next step availability
 */
function expectNextStepIsAllowed(isAllowed: boolean): void {
  expect(wizard.allowNext).toEqual(isAllowed);
}

describe('Unit Tests: WizardComponent', () => {
  let spectator: Spectator<WizardComponent>;
  const createdComponent = createComponentFactory({
    component: WizardComponent,
    declarations: [MockComponents(Dialog, Steps)]
  });
  beforeEach(() => {
    spectator = createdComponent();
    wizard = spectator.component;
  });

  it('should not have an available next step on init by default', () => {
    expectNextStepIsAllowed(false);
  });
});

describe('Integration Tests: WizardComponent with Mock Parent', () => {
  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory({
    component: TestComponent,
    imports: [WizardModule, RouterTestingModule, IncompleteDateModule]
>>>>>>> origin
  });

  /**
   * Initializes wizard component properties
   */
  function initGlobalVariables(): void {
    wizard = spectator.component.wizard;
<<<<<<< HEAD
    stepper = wizard.stepper;
=======
    wizard.items = stepperItems;
>>>>>>> origin
    contentChildren = wizard.content!;
  }

  /**
   * Checks if the wizard is on the first step
   */
  function expectFirstStep(): void {
    expect(wizard.index).toEqual(startIndex);
  }

  /**
<<<<<<< HEAD
   * Checks if the stepper is on the second step
   * @param movements The N-th movement (step)
   */
  function expectNthStep(movements: number): void {
    expect(stepper.index).toEqual(startIndex + movements);
  }

  /**
   * Checks if the stepper is on the last step
=======
   * Checks if the wizard is on the second step
   * @param movements The N-th movement (step)
   */
  function expectNthStep(movements: number): void {
    expect(wizard.index).toEqual(startIndex + movements);
  }

  /**
   * Checks if the wizard is on the last step
>>>>>>> origin
   */
  function expectLastStep(): void {
    expect(wizard.index).toEqual(contentChildren.length - 1);
  }

  /**
   * Checks if the save button was pressed
   * @param isSaved State of the save button
<<<<<<< HEAD
   */
  function expectIsSaved(isSaved: boolean): void {
    expect(wizard.isSaved).toEqual(isSaved);
  }

  /**
   * Checks if the close button is currently available and the wizard closable
   * @param isClosable State of the wizard closability
   */
  function expectIsClosable(isClosable: boolean): void {
    expect(wizard.closable).toEqual(isClosable);
  }

  /**
   * Checks if the next button is active
   * @param isAllowed State of next step availability
   */
  function expectNextStepIsAllowed(isAllowed: boolean): void {
    expect(wizard.allowNext).toEqual(isAllowed);
  }

  /**
   * Checks if the wizard was closed
   */
  function expectWizardClosed(): void {
    const indexes = stepper.index && wizard.index;
    expect(indexes).toEqual(startIndex);

    const stepperIndexEmitter = wizard.stepperIndexChange.emit;
    expect(stepperIndexEmitter).toHaveBeenCalledWith(startIndex);

    const propsOnClose = wizard.isVisible && wizard.isSaved;
    expect(propsOnClose).toBeFalse();

    const emitters = wizard.isVisibleChange.emit && wizard.savingChange.emit;
    expect(emitters).toHaveBeenCalledWith(wizard.isVisible);
=======
   */
  function expectIsSaved(isSaved: boolean): void {
    expect(wizard.isSaved).toEqual(isSaved);
  }

  /**
   * Checks if the close button is currently available and the wizard closable
   * @param isClosable State of the wizard to be closable
   */
  function expectIsClosable(isClosable: boolean): void {
    expect(wizard.closable).toEqual(isClosable);
>>>>>>> origin
  }

  /**
   * Moves the wizard to the last step (position)
   */
  function moveToLastStep(): void {
    for (let i = 0; i < contentChildren.length - 1; i++) {
      wizard.next();
    }
    fixture.detectChanges();
    expectLastStep();
<<<<<<< HEAD
    expectIsSaved(false);
    fixture.detectChanges();
  }

  /**
   * Checks if the save button is available
   */
  function expectSaveButtonIsAvailable(): void {
    expectStepperMovedUntilEnd();
    expectIsSaved(false);
=======
>>>>>>> origin
  }

  /**
   * Sets up the next wizard (position) available
   */
  function setNextStepAvailable(): void {
    wizard.allowNext = true;
    expectNextStepIsAllowed(true);
    fixture.detectChanges();
  }

  /**
   * @returns an HTML element
   * Gets and returns the HTML element of a native element
   * @param declaration The ID of the native element
   */
  function getNativeElementAsHTMLElement(declaration: string): HTMLElement {
    return spectator.query(declaration) as HTMLElement;
  }

  /**
   * Is pressing the (next) button inside the HTML template
   */
  function pressNextButton(): void {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    nextButton.click();
    fixture.detectChanges();
  }

  /**
   * Checks if the wizard moved to the first step
   */
  function expectMovementToFirstStep(): void {
<<<<<<< HEAD
    const emitIndexSpy = spyOn(wizard.stepperIndexChange, 'emit');
    expect(stepper.items.length).toEqual(childrenLabels.length);

    const wizardPropsOnMovement = wizard.isSaved && wizard.allowNext;
    expect(wizardPropsOnMovement).toBeFalse();

    expect(stepper.index).not.toEqual(stepper.items.length - 1);

    setNextStepAvailable();
    pressNextButton();

    expectNthStep(1);
    expect(emitIndexSpy).toHaveBeenCalledWith(stepper.index);
=======
    const wizardPropsOnMovement = wizard.isSaved && wizard.allowNext;
    expect(wizardPropsOnMovement).toBeFalse();

    setNextStepAvailable();
    pressNextButton();
    expectNthStep(1);
>>>>>>> origin
  }

  /**
   * Checks if the wizard moved to the next step
   * @param currentStep The current wizard position (step)
   */
  function expectMovementToNextStep(currentStep: number): void {
    expect(wizard.index).toEqual(currentStep + 1);
  }

  /**
   * @returns the information if the element is disabled
   * Checks if a native element is disabled
   * @param declaration the ID of a native element
   */
  function isElementDisabled(declaration: string): boolean {
    return (spectator.query(declaration) as HTMLButtonElement).disabled;
  }

  /**
   * Is pressing the back button
   */
  function pressBackButton(): void {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    backButton.click();
    fixture.detectChanges();
  }

  /**
   * Is pressing the save button
   */
  function pressSaveButton(): void {
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    saveButton.click();
    fixture.detectChanges();
  }

  /**
   * Is pressing the close button
   */
  function pressCloseButton(): void {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    closeButton.click();
    fixture.detectChanges();
  }

  /**
<<<<<<< HEAD
   * Spys on selected wizard emitters
   * @param onIndexChange Used for spying on the stepperIndexChange emitter
   * @param onVisibilityChange Used for spying on the isVisibleChange emitter
   * @param onSavingChange Used for spying on the savingChange emitter
   */
  function spyOnWizardEmitters(onIndexChange: boolean, onVisibilityChange: boolean, onSavingChange: boolean): void {
    if (onIndexChange) spyOn(wizard.stepperIndexChange, 'emit');
    if (onVisibilityChange) spyOn(wizard.isVisibleChange, 'emit');
    if (onSavingChange) spyOn(wizard.savingChange, 'emit');
  }

  beforeEach(() => {
    spectator = createdComponent();
=======
   * Checks if the close button is available
   */
  function expectCloseButtonIsAvailable(): void {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton).not.toBeNull();

    const isCloseButtonDisabled = isElementDisabled(closeButtonDeclaration);
    expect(isCloseButtonDisabled).toBeFalse();
  }

  beforeEach(() => {
    spectator = createComponent();
>>>>>>> origin
    fixture = spectator.fixture;
    initGlobalVariables();
    fixture.detectChanges();
  });

<<<<<<< HEAD
  it('should create parent component (mocked test component)', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should create Wizard', () => {
=======
  it('should be created', () => {
>>>>>>> origin
    expect(wizard).toBeTruthy();
  });

  it(`should have ${stepsNumber} steps`, () => {
    expect(wizard.items.length).toEqual(stepsNumber);
  });

  it('should have the correct start index', () => {
    expect(wizard.index).toEqual(startIndex);
  });

  it('should have the correct titles', () => {
    for (let i = 0; i < wizard.items.length; i++) {
      expect(wizard.items[i]).toEqual(stepperItems[i]);
    }
  });

  it('should have expected width and height', () => {
    expect(wizard).toBeTruthy();
    expect(wizard.width).toEqual(width);
    expect(wizard.height).toEqual(height);
  });

  it('should have available ContentChildren', () => {
    expect(contentChildren).toBeTruthy();
  });

  it('should have the correct number of content children', () => {
    expect(contentChildren.length).toEqual(childrenLabels.length);
  });

<<<<<<< HEAD
  it('should not have saved on init', () => {
    expectIsSaved(false);
  });

  it('should not have the next step available on init', () => {
    expectNextStepIsAllowed(false);
  });

  it('should have an internal Stepper', () => {
    expect(stepper).toBeTruthy();
=======
  it('should not be saved on init', () => {
    expectIsSaved(false);
  });

  it('should emit the current index on init', () => {
    const emitIndexSpy = spyOn(wizard.indexChange, 'emit');
    wizard.ngOnInit();
    expect(emitIndexSpy).toHaveBeenCalledWith(startIndex);
>>>>>>> origin
  });

  it('should have the correct number of available steps', () => {
    expect(wizard.items.length).toEqual(childrenLabels.length);
  });

<<<<<<< HEAD
  it('should be closable', () => {
=======
  it('should be closable by default', () => {
>>>>>>> origin
    expectIsClosable(true);
  });

  it('should be reseted', () => {
    expectFirstStep();
    moveToLastStep();
    wizard.ngOnChanges({
      isVisible: new SimpleChange(true, false, true)
    });
    expectFirstStep();
  });

  it('should correctly initialize the items', () => {
    const afterContentInitSpy = spyOn(wizard, 'ngAfterContentInit');
    wizard.ngAfterContentInit();

    expectFirstStep();
    expect(afterContentInitSpy).toHaveBeenCalled();
  });

  it('should have the right back button label', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.innerHTML).toContain(wizard.labelBackButton);
  });

  it('should have an available back button on init', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();
  });

<<<<<<< HEAD
  it('should have a visible back button while stepper index is < stepper index', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();
    expectFirstStep();
    wizard.move(true);
    expectNthStep(1);
  });

  it('should have a disabled back button while stepper index is 0', () => {
=======
  it('should have a disabled back button while current index is 0', () => {
>>>>>>> origin
    expectFirstStep();
    expect(isElementDisabled(backButtonDeclaration)).toBeTrue();
  });

  it('should have a disabled back button while current index is 0 and the form is invalid', () => {
    expectFirstStep();
    expectNextStepIsAllowed(false);
    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should have a disabled back button while current index is 0 and the form is valid', () => {
    expectFirstStep();
    expectNextStepIsAllowed(false);
<<<<<<< HEAD
=======

>>>>>>> origin
    setNextStepAvailable();
    expect(isElementDisabled(nextButtonDeclaration)).toBeFalse();
  });

<<<<<<< HEAD
  it('should have a disabled back button while stepper index is equals to max index', () => {
=======
  it('should have a disabled back button while current index is equals to max index', () => {
>>>>>>> origin
    expectNextStepIsAllowed(false);

    moveToLastStep();
    setNextStepAvailable();

    expect(isElementDisabled(backButtonDeclaration)).toBeFalse();
  });

<<<<<<< HEAD
  it('should have a disabled next button while stepper index is equals to max index', () => {
    expectNextStepIsAllowed(false);
=======
  it('should have a disabled next button while current index is equals to max index', () => {
    expectNextStepIsAllowed(false);

>>>>>>> origin
    moveToLastStep();
    setNextStepAvailable();

    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should have a next button while current index is 0', () => {
    expectFirstStep();
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
  });

  it('should have a next button while current index is < max index', () => {
    setNextStepAvailable();
    pressNextButton();

<<<<<<< HEAD
    wizard.move(true);
    expect(stepper.index).not.toEqual(startIndex);
    expectNthStep(1);
    expect(stepper.index).not.toBeGreaterThan(contentChildren.length - 1);
=======
    expectNthStep(1);
    expect(wizard.index).not.toBeGreaterThan(contentChildren.length - 1);
>>>>>>> origin
  });

  it('should have the right back button label', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.innerHTML).toContain(wizard.labelBackButton);
  });

<<<<<<< HEAD
  it('should have some classes on the back button', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.className).toContain(CLASS_FLEX && CLASS_ALIGN_CENTER && CLASS_JUSTIFY_CENTER && CLASS_MR_2);
  });

  it('should have a functional back button while stepper index > 0', () => {
=======
  it('should have a functional back button while current index > 0', () => {
>>>>>>> origin
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);

    pressBackButton();
    expectFirstStep();
  });

  it('should have a next button with the correct title', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.innerHTML).toContain(wizard.labelNextButton);
  });

<<<<<<< HEAD
  it('should have a next button with some classes', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.className).toContain(CLASS_FLEX && CLASS_ALIGN_CENTER && CLASS_JUSTIFY_CENTER && CLASS_MR_4);
  });

  it('should have a functional next button', () => {
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);
  });

  it('should use the correct save button label', () => {
    expectStepperMovedUntilEnd();
=======
  it('should use the correct save button label on last step', () => {
    moveToLastStep();
>>>>>>> origin
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton.innerHTML).toContain(wizard.labelSaveButton);
  });

<<<<<<< HEAD
  it('should have some classes on the save button', () => {
    expectStepperMovedUntilEnd();
    const nextButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(nextButton.className).toContain(CLASS_FLEX && CLASS_ALIGN_CENTER && CLASS_JUSTIFY_CENTER);
  });

=======
>>>>>>> origin
  it('should have a visible save button on last step', () => {
    moveToLastStep();
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton).not.toBeNull();
  });

  it('should have a save button be disabled on last step', () => {
    moveToLastStep();
    expectIsSaved(false);
    expect(isElementDisabled(saveButtonDeclaration)).toBeTrue();
  });

  it('should have a functional save button', () => {
    const param = true;
    spyOn(wizard.savingChange, 'emit').withArgs(param);

    moveToLastStep();
    expectIsSaved(false);
    expect(isElementDisabled(saveButtonDeclaration)).toBeTrue();

    setNextStepAvailable();
    expect(isElementDisabled(saveButtonDeclaration)).toBeFalse();

    pressSaveButton();
    expect(wizard.isSaved).not.toEqual(param);
    expect(wizard.savingChange.emit).toHaveBeenCalledWith(param);
    expectIsClosable(true);

    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();

    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();

    const isNextButtonDisabled = isElementDisabled(nextButtonDeclaration);
    expect(isNextButtonDisabled).toBeTrue();
  });

  it('should use the correct close button title', () => {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton.innerHTML).toContain(wizard.labelCloseButton);
  });

<<<<<<< HEAD
  it('should have a close button with some classes', () => {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton.className).toContain(CLASS_FLEX && CLASS_ALIGN_CENTER && CLASS_JUSTIFY_CENTER);
  });

=======
>>>>>>> origin
  it('should have an enabled close button on any step', () => {
    for (let i = 0; i < contentChildren.length - 1; i++) {
      setNextStepAvailable();
      pressNextButton();

<<<<<<< HEAD
      expectIsSaved(false);
      expectIsClosable(true);

      const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
      expect(closeButton).not.toBeNull();

      const isCloseButtonDisabled = isElementDisabled(closeButtonDeclaration);
      expect(isCloseButtonDisabled).toBeFalse();
      fixture.detectChanges();
    }
  });

  it('should have a functional close button', () => {
    spyOn(stepper, 'reset');
    spyOnWizardEmitters(true, true, true);

    expectIsClosable(true);
    pressCloseButton();
    expectIsSaved(false);
    expectWizardClosed();
  });

  it('should call the close handler after close button was pressed', () => {
    spyOn(wizard, 'closeDialog');
    pressCloseButton();
    expect(wizard.closeDialog).toHaveBeenCalled();
  });

  it('should have the correct start index', () => {
    expect(wizard.index).toEqual(startIndex);
  });

  it('should should emit an event after init', () => {
    spyOnWizardEmitters(true, false, false);

=======
      expectIsClosable(true);
      expectCloseButtonIsAvailable();
    }
  });

  it('should emit an event after init', () => {
    const indexChangeSpy = spyOn(wizard.indexChange, 'emit');
>>>>>>> origin
    wizard.ngOnInit();
    expect(indexChangeSpy).toHaveBeenCalledWith(wizard.index);
  });

  it('should correctly moving backward', () => {
    setNextStepAvailable();

    pressNextButton();
    expectNthStep(1);

    pressBackButton();
    expectFirstStep();
  });

<<<<<<< HEAD
  it('should have a stepper that correctly moves forward', () => {
    expectFirstStep();
    stepper.move(true);
    expectNthStep(1);
  });

  it('should have a stepper that correctly moves forward (via the parent)', () => {
    expectFirstStep();
    wizard.move(true);
    expectNthStep(1);
  });

  it('should have a stepper that correctly moves backward', () => {
    expectFirstStep();
    stepper.move(true);
    expectNthStep(1);

    stepper.move(false);
    expectFirstStep();
  });

  it('should have a stepper that correctly moves backward (via the parent)', () => {
    expectFirstStep();
    wizard.move(false);
    expectFirstStep();
  });

  it('should have a stepper that does not move out of bound on forward movement', () => {
=======
  it('should correctly moving forward', () => {
    const indexChangedSpy = spyOn(wizard.indexChange, 'emit');
    setNextStepAvailable();
    pressNextButton();

    expectNthStep(1);
    expect(indexChangedSpy).toHaveBeenCalledWith(wizard.index);
  });

  it('should not move out of bound on forward movement', () => {
>>>>>>> origin
    moveToLastStep();
    expect(wizard.index).toEqual(wizard.items.length - 1);
  });

<<<<<<< HEAD
  it('should have a stepper that does not move out of bound on backward movement', () => {
    expectFirstStep();
    stepper.move(false);
    expectFirstStep();
  });

  it('should have a not save functionality', () => {
    const state = false;
    spyOn(stepper, 'move').withArgs(state);
    spyOnWizardEmitters(false, false, true);
    wizard.save(state);
    expect(wizard.savingChange.emit).toHaveBeenCalledWith(state);
  });

  it('should have a save functionality', () => {
    const state = true;
    spyOnWizardEmitters(false, false, true);
    wizard.save(state);
    expect(wizard.isSaved).not.toEqual(state);
    expect(wizard.savingChange.emit).toHaveBeenCalledWith(state);
  });

  it('should be able to close', () => {
    spyOn(stepper, 'reset');
    spyOnWizardEmitters(true, true, true);

    wizard.closeDialog();
    expectWizardClosed();
  });

  it('should be closable 300ms after saving', fakeAsync(() => {
    expectIsClosable(true);

    moveToLastStep();
    fixture.detectChanges();
    expectLastStep();

    expectIsSaved(false);
    expectIsClosable(true);

    const isCloseButtonDisabled = isElementDisabled(closeButtonDeclaration);
    expect(isCloseButtonDisabled).toBeFalse();

    pressSaveButton();
    expectIsClosable(true);

    tick(300);
    wizard.closable = true;

    expectIsClosable(true);
    expect(isCloseButtonDisabled).toBeFalse();
  }));
=======
  it('should save', () => {
    const onSaveSpy = spyOn(wizard, 'save');

    moveToLastStep();
    setNextStepAvailable();
    pressSaveButton();

    expect(onSaveSpy).toHaveBeenCalled();
  });

  it('should not be able to save on any step before the last step', () => {
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton).toBeNull();
  });

  it('should be closable after saving', () => {
    expectIsSaved(false);
    expectIsClosable(true);

    moveToLastStep();
    pressSaveButton();
    expectIsClosable(true);
  });

  it('should close on close button click', () => {
    const visibilityChangedSpy = spyOn(wizard.isVisibleChange, 'emit');
    pressCloseButton();

    expect(wizard.isVisible).toBeFalse();

    expect(visibilityChangedSpy).toHaveBeenCalledWith(false);
  });
>>>>>>> origin
});
