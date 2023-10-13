import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {WizardComponent} from './wizard.component';
import {StepperComponent} from '../stepper/stepper.component';
import {WizardDirective} from '../../directives/wizard.directive';
import {RouterTestingModule} from '@angular/router/testing';
import {DialogModule} from 'primeng/dialog';
import {StepsModule} from 'primeng/steps';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {IncompleteDateModule} from '../../../incomplete-date/incomplete-date.module';
import {Component, QueryList, ViewChild} from '@angular/core';

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
  template:
    `
      <isy-wizard
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
let stepper: StepperComponent;
let contentChildren: QueryList<WizardDirective>;

describe('Integration Tests: WizardComponent with Mock Parent', () => {
  let parentComponent: TestComponent;
  let parentFixture: ComponentFixture<TestComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ]
    })
      .compileComponents();
  });

  /**
   * Initializes wizard component properties
   */
  function initGlobalVariables(): void {
    wizard = parentComponent.wizard;
    stepper = wizard.stepper;
    contentChildren = wizard.content!;
  }

  /**
   * Checks if the stepper is on the first step
   */
  function expectFirstStep(): void {
    expect(stepper.index).toEqual(startIndex);
  }

  /**
   * Checks if the stepper is on the last step
   */
  function expectLastStep(): void {
    expect(stepper.index).toEqual(contentChildren.length - 1);
  }

  /**
   * Checks if the wizard was closed
   */
  function expectWizardClosed(): void {
    expect(stepper.index && wizard.index).toEqual(startIndex);
    expect(wizard.stepperIndexChange.emit).toHaveBeenCalledWith(startIndex);

    expect(wizard.isVisible && wizard.isSaved).toBeFalse();
    expect(wizard.isVisibleChange.emit && wizard.savingChange.emit).toHaveBeenCalledWith(wizard.isVisible);
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
   * Checks if the stepper was moved to the last step
   */
  function expectStepperMovedUntilEnd(): void {
    expectFirstStep();
    moveToLastStep();
    expectLastStep();
    expect(wizard.isSaved).toBeFalse();
    parentFixture.detectChanges();
  }

  /**
   * Checks if the save button is available
   */
  function expectSaveButtonIsAvailable(): void {
    expectStepperMovedUntilEnd();
    expect(wizard.isSaved).toBeFalse();
  }

  /**
   * Sets up the next wizard (position) available
   */
  function setNextStepAvailable(): void {
    wizard.allowNext = true;
    expect(wizard.allowNext).toBeTrue();
    parentFixture.detectChanges();
  }

  /**
   * @returns an HTML element
   * Gets and returns the HTML element of a native element
   * @param declaration The ID of the native element
   */
  function getNativeElementAsHTMLElement(declaration: string): HTMLElement {
    return parentFixture.nativeElement.querySelector(declaration) as HTMLElement;
  }

  /**
   * Is pressing the (next) button inside the HTML template
   */
  function pressNextButton(): void {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    nextButton.click();
    parentFixture.detectChanges();
  }

  /**
   * Checks if the stepper moved to the first step
   */
  function expectMovementToFirstStep(): void {
    const emitIndexSpy = spyOn(wizard.stepperIndexChange, 'emit');
    expect(stepper.items.length).toEqual(childrenLabels.length);
    expect(wizard.isSaved && wizard.allowNext).toBeFalse();
    expect(stepper.index).not.toEqual(stepper.items.length - 1);

    setNextStepAvailable();
    pressNextButton();

    expect(stepper.index).toEqual(startIndex + 1);
    expect(emitIndexSpy).toHaveBeenCalledWith(stepper.index);
  }

  /**
   * Checks if the wizard moved to the next step
   * @param currentStep The current wizard position (step)
   */
  function expectMovementToNextStep(currentStep: number): void {
    expect(stepper.index).toEqual(currentStep + 1);
    expect(wizard.stepperIndexChange.emit).toHaveBeenCalledWith(stepper.index);
  }

  /**
   * @returns the information if the element is disabled
   * Checks if a native element is disabled
   * @param declaration the ID of a native element
   */
  function isElementDisabled(declaration: string): boolean {
    return parentFixture.nativeElement.querySelector(declaration).disabled;
  }

  /**
   * Is pressing the back button
   */
  function pressBackButton(): void {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    backButton.click();
    parentFixture.detectChanges();
  }

  /**
   * Is pressing the save button
   */
  function pressSaveButton(): void {
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    saveButton.click();
    parentFixture.detectChanges();
  }

  /**
   * Is pressing the close button
   */
  function pressCloseButton(): void {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    closeButton.click();
  }

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        WizardComponent,
        StepperComponent,
        WizardDirective,
        TestComponent
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        DialogModule,
        StepsModule,
        ButtonModule,
        IncompleteDateModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    parentFixture = TestBed.createComponent(TestComponent);
    parentComponent = parentFixture.componentInstance;
    parentFixture.detectChanges();
    initGlobalVariables();
  });

  it('should create parent component (mocked test component)', () => {
    expect(parentComponent).toBeTruthy();
  });

  it('should create Wizard', () => {
    expect(wizard).toBeTruthy();
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
    expect(wizard.isSaved).toBeFalse();
  });

  it('should not have the next step available on init', () => {
    expect(wizard.allowNext).toBeFalse();
  });

  it('should have an internal Stepper', () => {
    expect(stepper).toBeTruthy();
  });

  it('should have the correct number of available steps', () => {
    expect(stepper.items.length).toEqual(childrenLabels.length);
  });

  it('should be closable', () => {
    expect(wizard.closable).toBeTrue();
  });

  it('should have correctly initialized stepper items', () => {
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

  it('should have a visible back button while stepper index is < stepper index', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();
    expectFirstStep();
    wizard.move(true);
    expect(stepper.index).toEqual(startIndex + 1);
  });

  it('should have a disabled back button while stepper index is 0', () => {
    expectFirstStep();
    expect(isElementDisabled(backButtonDeclaration)).toBeTrue();
  });

  it('should have a disabled back button while stepper index is 0 and the form is invalid', () => {
    expectFirstStep();
    expect(wizard.allowNext).toBeFalse();
    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should have a disabled back button while stepper index is 0 and the form is valid', () => {
    expectFirstStep();
    expect(wizard.allowNext).toBeFalse();
    setNextStepAvailable();
    expect(isElementDisabled(nextButtonDeclaration)).toBeFalse();
  });

  it('should have a disabled back button while stepper index is equals to max index', () => {
    expect(wizard.allowNext).toBeFalse();

    moveToLastStep();
    expectLastStep();

    setNextStepAvailable();
    expect(isElementDisabled(backButtonDeclaration)).toBeFalse();
  });

  it('should have a disabled next button while stepper index is equals to max index', () => {
    expect(wizard.allowNext).toBeFalse();
    moveToLastStep();
    setNextStepAvailable();
    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should have a next button while stepper index is 0', () => {
    expectFirstStep();
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
  });

  it('should have a next button while stepper index is < max stepper index', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
    expectFirstStep();

    wizard.move(true);
    expect(stepper.index).not.toEqual(startIndex);
    expect(stepper.index).toEqual(startIndex + 1);
    expect(stepper.index).not.toBeGreaterThan(contentChildren.length - 1);
  });

  it('should have the right back button label', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.innerHTML).toContain(wizard.labelBackButton);
  });

  it('should have some classes on the back button', () => {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton.className).toContain(CLASS_FLEX);
    expect(backButton.className).toContain(CLASS_ALIGN_CENTER);
    expect(backButton.className).toContain(CLASS_JUSTIFY_CENTER);
    expect(backButton.className).toContain(CLASS_MR_2);
  });

  it('should have a functional back button while stepper index > 0', () => {
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);

    pressBackButton();

    expectFirstStep();
    expect(wizard.stepperIndexChange.emit).toHaveBeenCalledWith(startIndex);
  });

  it('should have a next button with the correct title', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.innerHTML).toContain(wizard.labelNextButton);
  });

  it('should have a next button with some classes', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.className).toContain(CLASS_FLEX);
    expect(nextButton.className).toContain(CLASS_ALIGN_CENTER);
    expect(nextButton.className).toContain(CLASS_JUSTIFY_CENTER);
    expect(nextButton.className).toContain(CLASS_MR_4);
  });

  it('should have a functional next button', () => {
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);
  });

  it('should use the correct save button label', () => {
    expectStepperMovedUntilEnd();
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton.innerHTML).toContain(wizard.labelSaveButton);
  });

  it('should have some classes on the save button', () => {
    expectStepperMovedUntilEnd();
    const nextButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(nextButton.className).toContain(CLASS_FLEX);
    expect(nextButton.className).toContain(CLASS_ALIGN_CENTER);
    expect(nextButton.className).toContain(CLASS_JUSTIFY_CENTER);
  });

  it('should have a visible save button on last step', () => {
    expectStepperMovedUntilEnd();

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
    expect(wizard.closable).toBeTrue();

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
    expect(closeButton.className).toContain(CLASS_FLEX);
    expect(closeButton.className).toContain(CLASS_ALIGN_CENTER);
    expect(closeButton.className).toContain(CLASS_JUSTIFY_CENTER);
  });

  it('should have an enabled close button on any step', () => {
    for (let i = 0; i < contentChildren.length - 1; i++) {
      expect(stepper.index).toEqual(i);
      stepper.move(true);

      expect(wizard.isSaved).toBeFalse();
      expect(wizard.closable).toBeTrue();

      const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
      expect(closeButton).not.toBeNull();

      const isCloseButtonDisabled = isElementDisabled(closeButtonDeclaration);
      expect(isCloseButtonDisabled).toBeFalse();
      parentFixture.detectChanges();
    }
  });

  it('should have a functional close button', () => {
    spyOn(stepper, 'reset');
    spyOn(wizard.stepperIndexChange, 'emit');
    spyOn(wizard.isVisibleChange, 'emit');
    spyOn(wizard.savingChange, 'emit');

    expect(wizard.closable).toBeTrue();
    pressCloseButton();
    expect(wizard.isSaved).toBeFalse();
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
    spyOn(wizard.stepperIndexChange, 'emit');

    wizard.ngOnInit();
    expect(wizard.stepperIndexChange.emit).toHaveBeenCalledWith(wizard.index);
  });

  it('should correctly reset', () => {
    const resetSpy = spyOn(stepper, 'reset');
    stepper.reset();
    expect(resetSpy).toHaveBeenCalled();
    expectFirstStep();
  });

  it('should have a stepper that correctly moves forward', () => {
    expectFirstStep();
    stepper.move(true);
    expect(stepper.index).toEqual(startIndex + 1);
  });

  it('should have a stepper that correctly moves forward (via the parent)', () => {
    expectFirstStep();
    wizard.move(true);
    expect(stepper.index).toEqual(startIndex + 1);
  });

  it('should have a stepper that correctly moves backward', () => {
    expectFirstStep();
    stepper.move(true);
    expect(stepper.index).toEqual(startIndex + 1);

    stepper.move(false);
    expectFirstStep();
  });

  it('should have a stepper that correctly moves backward (via the parent)', () => {
    expectFirstStep();
    wizard.move(false);
    expectFirstStep();
  });

  it('should have a stepper that does not move out of bound on forward movement', () => {
    moveToLastStep();
    stepper.move(true);
    expect(stepper.index).toEqual(stepper.items.length);
  });

  it('should have a stepper that does not move out of bound on backward movement', () => {
    expectFirstStep();
    stepper.move(false);
    expectFirstStep();
  });

  it('should have a not save functionality', () => {
    const param = false;
    spyOn(stepper, 'move').withArgs(param);
    spyOn(wizard.savingChange, 'emit');
    wizard.save(param);
    expect(wizard.savingChange.emit).toHaveBeenCalledWith(param);
  });

  it('should have a save functionality', () => {
    spyOn(wizard.savingChange, 'emit');
    const param = true;
    wizard.save(param);
    expect(wizard.isSaved).not.toEqual(param);
    expect(wizard.savingChange.emit).toHaveBeenCalledWith(param);
  });

  it('should be able to close', () => {
    spyOn(stepper, 'reset');
    spyOn(wizard.stepperIndexChange, 'emit');
    spyOn(wizard.isVisibleChange, 'emit');
    spyOn(wizard.savingChange, 'emit');

    wizard.closeDialog();
    expectWizardClosed();
  });

  it('should be closable 300ms after saving', fakeAsync(() => {
    expect(wizard.closable).toBeTrue();

    moveToLastStep();
    parentFixture.detectChanges();
    expectLastStep();

    expect(wizard.isSaved).toBeFalse();
    expect(wizard.closable).toBeTrue();
    const isCloseButtonDisabled = isElementDisabled(closeButtonDeclaration);
    expect(isCloseButtonDisabled).toBeFalse();

    pressSaveButton();
    expect(wizard.closable).toBeTrue();

    const milliseconds = 300;
    tick(milliseconds);
    wizard.closable = true;

    expect(wizard.closable).toBeTrue();
    expect(isCloseButtonDisabled).toBeFalse();
  }));
});
