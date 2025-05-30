import {ComponentFixture} from '@angular/core/testing';
import {WizardComponent} from './wizard.component';
import {WizardDirective} from '../../directives/wizard.directive';
import {Component, QueryList, SimpleChange, ViewChild} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IncompleteDateComponent} from '../../../incomplete-date/incomplete-date.component';
import {MenuItem} from 'primeng/api';
import {MockComponents} from 'ng-mocks';
import {Dialog} from 'primeng/dialog';
import {Steps} from 'primeng/steps';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {provideRouter} from '@angular/router';

const stepperItems: MenuItem[] = [
  {
    label: 'Auswahl 1'
  },
  {
    label: 'Auswahl 2'
  },
  {
    label: 'Auswahl 3'
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
  </isy-wizard>`,
  imports: [WizardComponent, IncompleteDateComponent, WizardDirective]
})
class TestComponent {
  @ViewChild('wizard') wizard!: WizardComponent;
}

let wizard: WizardComponent;
let contentChildren: QueryList<WizardDirective>;
let fixture: ComponentFixture<TestComponent>;

/**
 * Checks if the next button is active
 * @param isAllowed State of next step availability
 */
function expectNextStepIsAllowed(isAllowed: boolean): void {
  expect(wizard.allowNext).toEqual(isAllowed);
}

describe('Unit Tests: WizardComponent', () => {
  let spectator: Spectator<WizardComponent>;
  const createComponent = createComponentFactory({
    component: WizardComponent,
    declarations: [MockComponents(Dialog, Steps)]
  });
  beforeEach(() => {
    spectator = createComponent();
    wizard = spectator.component;
  });

  it('should create', () => {
    expect(wizard).toBeTruthy();
  });

  it('should not have an available next step on init by default', () => {
    expectNextStepIsAllowed(false);
  });
});

describe('Integration Tests: WizardComponent with Mock Parent', () => {
  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory({
    component: TestComponent,
    providers: [provideRouter([])]
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
   * @param isClosable State of the wizard to be closable
   */
  function expectIsClosable(isClosable: boolean): void {
    expect(wizard.closable).toEqual(isClosable);
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
    const wizardPropsOnMovement = wizard.isSaved && wizard.allowNext;
    expect(wizardPropsOnMovement).toBeFalse();

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
    fixture = spectator.fixture;
    initGlobalVariables();
    fixture.detectChanges();
  });

  it('should be created', () => {
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

  it('should not be saved on init', () => {
    expectIsSaved(false);
  });

  it('should emit the current index on init', () => {
    const emitIndexSpy = spyOn(wizard.indexChange, 'emit');
    wizard.ngOnInit();
    expect(emitIndexSpy).toHaveBeenCalledWith(startIndex);
  });

  it('should have the correct number of available steps', () => {
    expect(wizard.items.length).toEqual(childrenLabels.length);
  });

  it('should be closable by default', () => {
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

  it('should use the correct back button label', () => {
    setNextStepAvailable();
    pressNextButton();
    expectNthStep(1);
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);

    expect(backButton.innerHTML).toContain(wizard.labelBackButton);
  });

  it('should not have a back button while current index is 0', () => {
    expectFirstStep();
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);

    expect(backButton).toBeNull();
  });

  it('should have a functional back button while current index > 0', () => {
    expectMovementToFirstStep();
    expectMovementToNextStep(startIndex);

    pressBackButton();
    expectFirstStep();
  });

  it('should have a back button while current index is equal to max index', () => {
    expectNextStepIsAllowed(false);

    moveToLastStep();
    setNextStepAvailable();

    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).not.toBeNull();
  });

  it('should use the correct next button label', () => {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton.innerHTML).toContain(wizard.labelNextButton);
  });

  it('should have a next button while current index is 0', () => {
    expectFirstStep();
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
  });

  it('should have a disabled next button while current index is 0 and the form is invalid', () => {
    expectFirstStep();
    expectNextStepIsAllowed(false);
    expect(isElementDisabled(nextButtonDeclaration)).toBeTrue();
  });

  it('should not have a disabled next button while current index is 0 and the form is valid', () => {
    expectFirstStep();
    expectNextStepIsAllowed(false);
    setNextStepAvailable();
    expect(isElementDisabled(nextButtonDeclaration)).toBeFalse();
  });

  it('should have a next button while current index is < max index', () => {
    setNextStepAvailable();
    pressNextButton();

    expectNthStep(1);
    expect(wizard.index).not.toBeGreaterThan(contentChildren.length - 1);

    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).not.toBeNull();
  });

  it('should not have a next button while current index is equal to max index', () => {
    expectNextStepIsAllowed(false);

    moveToLastStep();
    setNextStepAvailable();

    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).toBeNull();
  });

  it('should use the correct save button label on last step', () => {
    moveToLastStep();
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton.innerHTML).toContain(wizard.labelSaveButton);
  });

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
    expect(nextButton).toBeNull();
  });

  it('should use the correct close button title', () => {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton.innerHTML).toContain(wizard.labelCloseButton);
  });

  it('should have an enabled close button on any step', () => {
    for (let i = 0; i < contentChildren.length - 1; i++) {
      setNextStepAvailable();
      pressNextButton();

      expectIsClosable(true);
      expectCloseButtonIsAvailable();
    }
  });

  it('should emit an event after init', () => {
    const indexChangeSpy = spyOn(wizard.indexChange, 'emit');
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

  it('should correctly moving forward', () => {
    const indexChangedSpy = spyOn(wizard.indexChange, 'emit');
    setNextStepAvailable();
    pressNextButton();

    expectNthStep(1);
    expect(indexChangedSpy).toHaveBeenCalledWith(wizard.index);
  });

  it('should not move out of bound on forward movement', () => {
    moveToLastStep();
    expect(wizard.index).toEqual(wizard.items.length - 1);
  });

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
});

describe('Accessibility Test: WizardComponent', () => {
  let spectator: Spectator<TestComponent>;
  const mockConfigService = jasmine.createSpyObj('WidgetsConfigService', ['getTranslation']);
  const createComponent = createComponentFactory({
    component: TestComponent,
    mocks: [WidgetsConfigService],
    providers: [provideRouter([])]
  });

  beforeEach(() => {
    mockConfigService.getTranslation.and.returnValue('Close');
    spectator = createComponent({providers: [{provide: WidgetsConfigService, useValue: mockConfigService}]});
    wizard = spectator.component.wizard;
    wizard.items = stepperItems;
    contentChildren = wizard.content!;
    spectator.detectChanges();
  });

  it('the dialog close icon should have an aria-label attribute with "Close"', () => {
    const element = spectator.query('.p-dialog-close-button') as HTMLElement;
    expect(element.getAttribute('aria-label')).toBe('Close');
  });

  it('should update the index and emit the indexChange event on active index change', () => {
    const newIndex = 1;
    const emitSpy = spyOn(wizard.indexChange, 'emit');
    wizard.items = stepperItems;

    wizard.onActiveIndexChange(newIndex);

    expect(wizard.index).toEqual(newIndex);
    expect(emitSpy).toHaveBeenCalledWith(newIndex);
  });

  it('should display a toast message indicating the step change', () => {
    const newIndex = 1;
    const toastSpy = spyOn(wizard.messageService, 'add');
    wizard.items = stepperItems;

    wizard.onActiveIndexChange(newIndex);

    expect(toastSpy).toHaveBeenCalledWith({
      severity: 'info',
      summary: mockConfigService.getTranslation('wizard.toast.stepChanged'),
      detail: stepperItems[newIndex].label
    });
  });
});
