import {ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {WizardComponent} from './wizard.component';
import {WizardDirective} from '../../directives/wizard.directive';
import {RouterTestingModule} from '@angular/router/testing';
import {Component, QueryList, ViewChild} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {WizardModule} from '../../wizard.module';
import {IncompleteDateModule} from '../../../incomplete-date/incomplete-date.module';
import {MenuItem} from 'primeng/api';

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

const width = 50;
const height = 30;
const headerTitle = 'Wizard Title';
const childrenLabels = ['Auswahl 1', 'Auswahl 2', 'Auswahl 3'];
const startIndex = 0;

const backButtonDeclaration = '#back-button';
const nextButtonDeclaration = '#next-button';
const saveButtonDeclaration = '#save-button';
const closeButtonDeclaration = '#close-button';

const CLASS_FLEX = 'flex';
const CLASS_ALIGN_CENTER = 'align-items-center';
const CLASS_JUSTIFY_CENTER = 'justify-content-center';
const CLASS_MR_2 = 'mr-2';
const CLASS_MR_4 = 'mr-4';

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

describe('Integration Tests: WizardComponent with Mock Parent', () => {
  let spectator: Spectator<TestComponent>;
  const createdComponent = createComponentFactory({
    component: TestComponent,
    imports: [WizardModule, RouterTestingModule, IncompleteDateModule]
  });

  /**
   * Initializes wizard component properties
   */
  function initGlobalVariables(): void {
    wizard = spectator.component.wizard;
    wizard.items = stepperItems;
    contentChildren = wizard.content!;
  }

  /**
   * Checks if the wizard is on the first step
   */
  function expectFirstStep(): void {
    expect(wizard.index).toEqual(startIndex);
  }

  /**
   * Checks if the wizard is on the second step
   * @param movements The N-th movement (step)
   */
  function expectNthStep(movements: number): void {
    expect(wizard.index).toEqual(startIndex + movements);
  }

  /**
   * Checks if the wizard is on the last step
   */
  function expectLastStep(): void {
    expect(wizard.index).toEqual(contentChildren.length - 1);
  }

  /**
   * Checks if the save button was pressed
   * @param isSaved State of the save button
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
   * Moves the wizard to the last step (position)
   */
  function moveToLastStep(): void {
    for (let i = 0; i < contentChildren.length - 1; i++) {
      wizard.move(true);
    }
  }

  /**
   * Checks if the wizard was moved to the last step
   */
  function expectwizardMovedUntilEnd(): void {
    expectFirstStep();
    moveToLastStep();
    expectLastStep();
    expectIsSaved(false);
    fixture.detectChanges();
  }

  /**
   * Checks if the save button is available
   */
  function expectSaveButtonIsAvailable(): void {
    expectwizardMovedUntilEnd();
    expectIsSaved(false);
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
    expect(wizard.items.length).toEqual(childrenLabels.length);

    const wizardPropsOnMovement = wizard.isSaved && wizard.allowNext;
    expect(wizardPropsOnMovement).toBeFalse();

    expect(wizard.index).not.toEqual(wizard.items.length - 1);

    setNextStepAvailable();
    pressNextButton();

    expectNthStep(1);
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
   * Spys on selected wizard emitters
   * @param onIndexChange Used for spying on the wizardIndexChange emitter
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
    fixture = spectator.fixture;
    initGlobalVariables();
    fixture.detectChanges();
  });

  it('should create parent component (mocked test component)', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should have ${stepsNumber} steps`, () => {
    expect(wizard.items.length).toEqual(stepsNumber);
  });

  it('should have the correct stepper items titles', () => {
    for (let i = 0; i < wizard.items.length; i++) {
      expect(wizard.items[i]).toEqual(stepperItems[i]);
    }
  });

  it('should have expected width and height', () => {
    expect(wizard).toBeTruthy();
    expect(wizard.width).toEqual(width);
    expect(wizard.height).toEqual(height);
  });

  it('should have ContentChildren available', () => {
    expect(contentChildren).not.toBeUndefined();
    expect(contentChildren).toBeTruthy();
  });

  it('should have the correct number of content children', () => {
    expect(contentChildren.length).toEqual(childrenLabels.length);
  });

  it('should not have saved on init', () => {
    expectIsSaved(false);
  });

  it('should not have the next step available on init', () => {
    expectNextStepIsAllowed(false);
  });

  it('should have an internal wizard', () => {
    expect(wizard).toBeTruthy();
  });

  it('should have the correct number of available steps', () => {
    expect(wizard.items.length).toEqual(childrenLabels.length);
  });

  it('should be closable by default', () => {
    expectIsClosable(true);
  });

  it('should have correctly initialized wizard items', () => {
    const afterContentInitSpy = spyOn(wizard, 'ngAfterContentInit');
    wizard.ngAfterContentInit();
    expect(afterContentInitSpy).toHaveBeenCalled();
    expectFirstStep();
  });

  it('should emit the index on init', () => {
    const emitIndexSpy = spyOn(wizard.stepperIndexChange, 'emit');
    wizard.ngOnInit();
    expectFirstStep();
    expect(emitIndexSpy).toHaveBeenCalledWith(startIndex);
  });

  it('should have the right back button label', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.innerHTML).toContain(wizard.labelBackButton);
  });

  it('should have a back button', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();
    expectFirstStep();
  });

  it('should have a visible back button while wizard index is < wizard index', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();
    expectFirstStep();
    wizard.move(true);
    expectNthStep(1);
  });

  it('should have a disabled back button while wizard index is 0', () => {
    expectFirstStep();
    expect(isElementDisabled(backButtonDeclaration)).toBeTrue();
  });

  it('should have a disabled back button while wizard index is 0 and the form is invalid', () => {
    expectFirstStep();
    expectNextStepIsAllowed(false);
    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should have a disabled back button while wizard index is 0 and the form is valid', () => {
    expectFirstStep();
    expectNextStepIsAllowed(false);
    setNextStepAvailable();
    expect(isElementDisabled(nextButtonDeclaration)).toBeFalse();
  });

  it('should have a disabled back button while wizard index is equals to max index', () => {
    expectNextStepIsAllowed(false);

    moveToLastStep();
    expectLastStep();

    setNextStepAvailable();
    expect(isElementDisabled(backButtonDeclaration)).toBeFalse();
  });

  it('should have a disabled next button while wizard index is equals to max index', () => {
    expectNextStepIsAllowed(false);
    moveToLastStep();
    setNextStepAvailable();
    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should have a next button while wizard index is 0', () => {
    expectFirstStep();
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
  });

  it('should have a next button while wizard index is < max wizard index', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
    expectFirstStep();

    wizard.move(true);
    expect(wizard.index).not.toEqual(startIndex);
    expectNthStep(1);
    expect(wizard.index).not.toBeGreaterThan(contentChildren.length - 1);
  });

  it('should have the right back button label', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.innerHTML).toContain(wizard.labelBackButton);
  });

  it('should have some classes on the back button', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.className).toContain(CLASS_FLEX && CLASS_ALIGN_CENTER && CLASS_JUSTIFY_CENTER && CLASS_MR_2);
  });

  it('should have a functional back button while wizard index > 0', () => {
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);
    pressBackButton();
    expectFirstStep();
  });

  it('should have a next button with the correct title', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.innerHTML).toContain(wizard.labelNextButton);
  });

  it('should have a next button with some classes', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.className).toContain(CLASS_ALIGN_CENTER);
    expect(nextButton.className).toContain(CLASS_JUSTIFY_CENTER);
    expect(nextButton.className).toContain(CLASS_MR_4);
  });

  it('should have a functional next button', () => {
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);
  });

  it('should use the correct save button label', () => {
    expectwizardMovedUntilEnd();
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton.innerHTML).toContain(wizard.labelSaveButton);
  });

  it('should have some classes on the save button', () => {
    expectwizardMovedUntilEnd();
    const nextButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(nextButton.className).toContain(CLASS_FLEX);
    expect(nextButton.className).toContain(CLASS_ALIGN_CENTER);
    expect(nextButton.className).toContain(CLASS_JUSTIFY_CENTER);
  });

  it('should have a visible save button on last step', () => {
    expectwizardMovedUntilEnd();

    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton).not.toBeNull();
  });

  it('should have disabled save button on last step', () => {
    expectSaveButtonIsAvailable();
    expect(isElementDisabled(saveButtonDeclaration)).toBeTrue();
  });

  it('should have functional save button', () => {
    const param = true;
    spyOn(wizard.savingChange, 'emit').withArgs(param);
    expectSaveButtonIsAvailable();
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
  });

  it('should use the correct close button title', () => {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton.innerHTML).toContain(wizard.labelCloseButton);
  });

  it('should have a close button with some classes', () => {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton.className).toContain(CLASS_FLEX && CLASS_ALIGN_CENTER && CLASS_JUSTIFY_CENTER);
  });

  it('should have an enabled close button on any step', () => {
    for (let i = 0; i < contentChildren.length - 1; i++) {
      expect(wizard.index).toEqual(i);
      wizard.move(true);

      expectIsSaved(false);
      expectIsClosable(true);

      const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
      expect(closeButton).not.toBeNull();

      const isCloseButtonDisabled = isElementDisabled(closeButtonDeclaration);
      expect(isCloseButtonDisabled).toBeFalse();
      fixture.detectChanges();
    }
  });

  it('should close on close button click', () => {
    wizard.isVisible = true;
    wizard.closable = true;
    fixture.detectChanges();

    const closeDialogSpy = spyOn(wizard, 'closeDialog');
    pressCloseButton();

    expect(closeDialogSpy).toHaveBeenCalled();
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

    wizard.ngOnInit();
    expect(wizard.stepperIndexChange.emit).toHaveBeenCalledWith(wizard.index);
  });

  it('should have a wizard that correctly moves backward', () => {
    expectFirstStep();
    wizard.move(true);
    expectNthStep(1);

    wizard.move(false);
    expectFirstStep();
  });

  it('should have a wizard that does not move out of bound on forward movement', () => {
    moveToLastStep();
    wizard.move(true);
    expect(wizard.index).toEqual(wizard.items.length);
  });

  it('should have a not save functionality', () => {
    const state = false;
    spyOn(wizard, 'move').withArgs(state);
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
});
