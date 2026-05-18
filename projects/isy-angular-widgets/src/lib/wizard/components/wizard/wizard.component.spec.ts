import {CommonModule} from '@angular/common';
import {ComponentFixture, MetadataOverride} from '@angular/core/testing';
import {
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChange,
  TemplateRef,
  ViewChild,
  inject
} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {WizardDirective} from '../../directives/wizard.directive';
import {WizardFooterDirective} from '../../directives/wizard-footer.directive';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IncompleteDateComponent} from '../../../incomplete-date/incomplete-date.component';
import {MenuItem} from 'primeng/api';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {StepperModule} from 'primeng/stepper';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {provideRouter} from '@angular/router';

@Directive({
  selector: '[pTemplate]',
  standalone: true
})
class PTemplateStubDirective {
  @Input('pTemplate') name!: string;
  template: TemplateRef<unknown> = inject(TemplateRef);
}

@Directive({
  selector: '[pButton]',
  standalone: true
})
class PButtonStubDirective {
  @Input() outlined?: boolean;
}

@Directive({
  selector: '[pRipple]',
  standalone: true
})
class PRippleStubDirective {}

@Component({
  selector: 'p-toast',
  standalone: true,
  template: ''
})
class ToastStubComponent {
  @Input() baseZIndex?: number;
}

@Component({
  selector: 'p-stepper',
  standalone: true,
  template: `<div class="p-stepper"><ng-content></ng-content></div>`
})
class StepperStubComponent {
  @Input() value?: number;
  @Input() linear = false;
  @Output() valueChange = new EventEmitter<number | undefined>();
}

@Component({
  selector: 'p-step-list',
  standalone: true,
  template: `<div class="p-step-list"><ng-content></ng-content></div>`
})
class StepListStubComponent {}

@Component({
  selector: 'p-step',
  standalone: true,
  template: `<div class="p-step"><ng-content></ng-content></div>`
})
class StepStubComponent {
  @Input() value?: number;
  @Input() disabled = false;
}

@Component({
  selector: 'p-dialog',
  standalone: true,
  imports: [CommonModule, PTemplateStubDirective, StepperModule],
  template: `
    <div class="p-dialog">
      <button class="p-dialog-close-button" type="button" [attr.aria-label]="closeAriaLabel">×</button>
      <ng-content></ng-content>
      <ng-container *ngIf="footerTpl" [ngTemplateOutlet]="footerTpl.template"></ng-container>
    </div>
  `
})
class DialogStubComponent {
  @Input() header?: string;
  @Input() closeAriaLabel?: string;
  @Input() modal?: boolean;
  @Input() closable?: boolean;
  @Input() draggable?: boolean;
  @Input() breakpoints?: Record<string, unknown>;
  @Input() style?: Record<string, unknown>;
  @Input() visible?: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ContentChildren(PTemplateStubDirective) templates?: QueryList<PTemplateStubDirective>;

  get footerTpl(): PTemplateStubDirective | undefined {
    return this.templates?.find((t) => t.name === 'footer');
  }
}

const stepperItems: MenuItem[] = [{label: 'Auswahl 1'}, {label: 'Auswahl 2'}, {label: 'Auswahl 3'}];
const stepsNumber: number = stepperItems.length;
const startIndex = 0;
const backButtonDeclaration = '#back-button';
const nextButtonDeclaration = '#next-button';
const saveButtonDeclaration = '#save-button';
const closeButtonDeclaration = '#close-button';

@Component({
  template: ` <isy-wizard
    #wizard
    [width]="width"
    [height]="height"
    [headerTitle]="headerTitle"
    [isVisible]="true"
    [allowNext]="false"
  >
    <isy-incomplete-date *isyWizardDirective="childrenLabels[0]"></isy-incomplete-date>
    <isy-incomplete-date *isyWizardDirective="childrenLabels[1]"></isy-incomplete-date>
    <isy-incomplete-date *isyWizardDirective="childrenLabels[childrenLabels.length - 1]"></isy-incomplete-date>
  </isy-wizard>`,
  imports: [WizardComponent, IncompleteDateComponent, WizardDirective]
})
class TestComponent {
  @ViewChild('wizard') wizard!: WizardComponent;

  width = 50;
  height = 30;
  headerTitle = 'Wizard Title';
  childrenLabels = ['Auswahl 1', 'Auswahl 2', 'Auswahl 3'];
}

@Component({
  template: ` <isy-wizard #wizard [isVisible]="true" [allowNext]="allowNext">
    <isy-incomplete-date *isyWizardDirective="childrenLabels[0]"></isy-incomplete-date>
    <isy-incomplete-date *isyWizardDirective="childrenLabels[1]"></isy-incomplete-date>
    <isy-incomplete-date *isyWizardDirective="childrenLabels[2]"></isy-incomplete-date>

    <ng-template
      isyWizardFooter
      let-index="index"
      let-showBack="showBack"
      let-showNext="showNext"
      let-showSave="showSave"
      let-allowNext="allowNext"
      let-next="next"
      let-previous="previous"
      let-save="save"
      let-close="close"
    >
      <div id="custom-footer">
        <span id="custom-index">{{ index }}</span>
        @if (showBack) {
          <button id="custom-back-button" type="button" (click)="previous()">Back</button>
        }
        @if (showNext) {
          <button id="custom-next-button" type="button" [disabled]="!allowNext" (click)="next()">Next</button>
        }
        @if (showSave) {
          <button id="custom-save-button" type="button" [disabled]="!allowNext" (click)="save()">Save</button>
        }
        <button id="custom-close-button" type="button" (click)="close()">Close</button>
      </div>
    </ng-template>
  </isy-wizard>`,
  imports: [WizardComponent, IncompleteDateComponent, WizardDirective, WizardFooterDirective]
})
class TestCustomFooterComponent {
  @ViewChild('wizard') wizard!: WizardComponent;

  allowNext = false;
  childrenLabels = ['Auswahl 1', 'Auswahl 2', 'Auswahl 3'];
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

const widgetsConfigServiceStub: Pick<WidgetsConfigService, 'getTranslation'> = {
  getTranslation: (key: string) => key
};

const wizardOverride: MetadataOverride<Component> = {
  remove: {
    imports: [StepperModule, DialogModule, ButtonModule, ToastModule]
  },
  add: {
    imports: [
      CommonModule,
      DialogStubComponent,
      StepperStubComponent,
      StepListStubComponent,
      StepStubComponent,
      ToastStubComponent,
      PTemplateStubDirective,
      PButtonStubDirective,
      PRippleStubDirective
    ]
  }
};

describe('Unit Tests: WizardComponent', () => {
  let spectator: Spectator<WizardComponent>;
  const createComponent = createComponentFactory({
    component: WizardComponent,
    providers: [{provide: WidgetsConfigService, useValue: widgetsConfigServiceStub}],
    overrideComponents: [[WizardComponent, wizardOverride]]
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

  it('should map stepper value to zero-based index', () => {
    wizard.items = stepperItems;
    wizard.allowFreeNavigation = true;

    const emitSpy = spyOn(wizard.indexChange, 'emit');
    const toastSpy = spyOn(wizard.messageService, 'add');

    wizard.onStepperValueChange(2);

    expect(wizard.index).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith(1);
    expect(toastSpy).toHaveBeenCalled();
  });

  it('should ignore undefined stepper value', () => {
    wizard.items = stepperItems;
    wizard.allowFreeNavigation = true;

    const emitSpy = spyOn(wizard.indexChange, 'emit');

    wizard.onStepperValueChange(undefined);

    expect(wizard.index).toBe(0);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should ignore out-of-range stepper value', () => {
    wizard.items = stepperItems;
    wizard.allowFreeNavigation = true;

    const emitSpy = spyOn(wizard.indexChange, 'emit');

    wizard.onStepperValueChange(99);

    expect(wizard.index).toBe(0);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});

/**
 * Initializes wizard component properties
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
 * Checks if the wizard moved to the next step based on the given current step.
 * @param currentStep The current step index before moving forward.
 */
function expectMovementToNextStep(currentStep: number): void {
  expect(wizard.index).toEqual(currentStep + 1);
}

describe('Integration Tests: WizardComponent with Mock Parent', () => {
  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory({
    component: TestComponent,
    providers: [provideRouter([]), {provide: WidgetsConfigService, useValue: widgetsConfigServiceStub}],
    overrideComponents: [[WizardComponent, wizardOverride]]
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
   * Queries the host DOM for an element matching the provided selector.
   * @param declaration CSS selector (e.g. '#next-button').
   * @returns The found element as HTMLElement or null if not present.
   */
  function getNativeElementAsHTMLElement(declaration: string): HTMLElement | null {
    return spectator.query<HTMLElement>(declaration);
  }

  /**
   * Returns the ids of all rendered footer buttons in DOM order.
   * @returns A list of non-empty button ids.
   */
  function getFooterButtonIds(): string[] {
    return spectator
      .queryAll<HTMLButtonElement>('button')
      .map((button) => button.id)
      .filter((id) => !!id);
  }

  /**
   * Checks whether the element matching the provided selector is disabled.
   * @param declaration CSS selector (e.g. '#next-button').
   * @returns True if the element is disabled, otherwise false.
   */
  function isElementDisabled(declaration: string): boolean {
    const el = spectator.query<HTMLButtonElement>(declaration);
    expect(el).withContext(`Element not found: ${declaration}`).not.toBeNull();
    return el!.disabled;
  }

  /**
   * Is pressing the next button
   */
  function pressNextButton(): void {
    const nextButton = getNativeElementAsHTMLElement(nextButtonDeclaration);
    expect(nextButton).withContext('Next button not found').not.toBeNull();
    nextButton!.click();
    fixture.detectChanges();
  }

  /**
   * Is pressing the back button
   */
  function pressBackButton(): void {
    const backButton = getNativeElementAsHTMLElement(backButtonDeclaration);
    expect(backButton).withContext('Back button not found').not.toBeNull();
    backButton!.click();
    fixture.detectChanges();
  }

  /**
   * Is pressing the save button
   */
  function pressSaveButton(): void {
    const saveButton = getNativeElementAsHTMLElement(saveButtonDeclaration);
    expect(saveButton).withContext('Save button not found').not.toBeNull();
    saveButton!.click();
    fixture.detectChanges();
  }

  /**
   * Is pressing the close button
   */
  function pressCloseButton(): void {
    const closeButton = getNativeElementAsHTMLElement(closeButtonDeclaration);
    expect(closeButton).withContext('Close button not found').not.toBeNull();
    closeButton!.click();
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

  /**
   * Moves from the first step to the next step and asserts the wizard state is reset correctly.
   */
  function expectMovementToFirstStep(): void {
    const wizardPropsOnMovement = wizard.isSaved && wizard.allowNext;
    expect(wizardPropsOnMovement).toBeFalse();

    setNextStepAvailable();
    pressNextButton();
    expectNthStep(1);
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
    expect(wizard.width).toEqual(spectator.component.width);
    expect(wizard.height).toEqual(spectator.component.height);
  });

  it('should have available ContentChildren', () => {
    expect(contentChildren).toBeTruthy();
  });

  it('should have the correct number of content children', () => {
    expect(contentChildren.length).toEqual(spectator.component.childrenLabels.length);
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
    expect(wizard.items.length).toEqual(spectator.component.childrenLabels.length);
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
    expect(backButton).not.toBeNull();
    expect(backButton!.innerHTML).toContain(wizard.labelBackButton);
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
    expect(nextButton).not.toBeNull();
    expect(nextButton!.innerHTML).toContain(wizard.labelNextButton);
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
    expect(saveButton).not.toBeNull();
    expect(saveButton!.innerHTML).toContain(wizard.labelSaveButton);
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
    expect(closeButton).not.toBeNull();
    expect(closeButton!.innerHTML).toContain(wizard.labelCloseButton);
  });

  it('should render close before next on the first step', () => {
    expect(getFooterButtonIds()).toEqual(['close-button', 'next-button']);
  });

  it('should render close, back and save on the last step in that order', () => {
    moveToLastStep();
    setNextStepAvailable();

    expect(getFooterButtonIds()).toEqual(['close-button', 'back-button', 'save-button']);
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

describe('Integration Tests: WizardComponent with Custom Footer', () => {
  let spectator: Spectator<TestCustomFooterComponent>;
  const createComponent = createComponentFactory({
    component: TestCustomFooterComponent,
    providers: [provideRouter([]), {provide: WidgetsConfigService, useValue: widgetsConfigServiceStub}],
    overrideComponents: [[WizardComponent, wizardOverride]]
  });

  /**
   * Clicks a custom footer button and updates the fixture afterwards.
   * @param selector CSS selector of the button to click.
   */
  function clickButton(selector: string): void {
    const button = spectator.query<HTMLButtonElement>(selector);
    expect(button).withContext(`Button not found: ${selector}`).not.toBeNull();
    button!.click();
    spectator.detectChanges();
  }

  beforeEach(() => {
    spectator = createComponent();
    wizard = spectator.component.wizard;
    wizard.items = stepperItems;
    spectator.detectChanges();
  });

  it('should render the custom footer instead of the default footer', () => {
    expect(spectator.query('#custom-footer')).not.toBeNull();
    expect(spectator.query(closeButtonDeclaration)).toBeNull();
  });

  it('should expose the current index in the footer context', () => {
    const indexValue = spectator.query('#custom-index');
    expect(indexValue).not.toBeNull();
    expect(indexValue!.textContent?.trim()).toBe('0');
  });

  it('should use the projected next action from the footer context', () => {
    const emitSpy = spyOn(wizard.indexChange, 'emit');
    spectator.component.allowNext = true;
    spectator.detectChanges();

    clickButton('#custom-next-button');

    expect(wizard.index).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should use the projected save action from the footer context', () => {
    const saveSpy = spyOn(wizard.savingChange, 'emit');
    spectator.component.allowNext = true;
    wizard.index = 2;
    spectator.detectChanges();

    clickButton('#custom-save-button');

    expect(saveSpy).toHaveBeenCalledWith(true);
  });

  it('should use the projected close action from the footer context', () => {
    const visibilitySpy = spyOn(wizard.isVisibleChange, 'emit');

    clickButton('#custom-close-button');

    expect(wizard.isVisible).toBeFalse();
    expect(visibilitySpy).toHaveBeenCalledWith(false);
  });
});

describe('Accessibility Test: WizardComponent', () => {
  let spectator: Spectator<TestComponent>;
  const mockConfigService = jasmine.createSpyObj('WidgetsConfigService', ['getTranslation']);
  const createComponent = createComponentFactory({
    component: TestComponent,
    providers: [provideRouter([])],
    overrideComponents: [[WizardComponent, wizardOverride]]
  });

  beforeEach(() => {
    mockConfigService.getTranslation.and.callFake((key: string) => {
      if (key === 'wizard.aria.close') return 'Close';
      if (key === 'wizard.toast.stepChanged') return 'Step changed';
      return key;
    });

    spectator = createComponent({
      providers: [{provide: WidgetsConfigService, useValue: mockConfigService}]
    });

    wizard = spectator.component.wizard;
    wizard.items = stepperItems;
    contentChildren = wizard.content!;
    spectator.detectChanges();
  });

  it('the dialog close icon should have an aria-label attribute with "Close"', () => {
    const element = spectator.query('.p-dialog-close-button') as HTMLElement;
    expect(element.getAttribute('aria-label')).toBe('Close');
  });

  it('should update the index and emit the indexChange event on step change', () => {
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
